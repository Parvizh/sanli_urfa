import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { backupMenu, randomSelection } from "../helpers/menu-helper";
import { BackupResponse } from '../helpers/menu-helper';
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, EntityTarget, Not } from 'typeorm';
import { Product } from "./entities/product.entity";
import { Category } from "./entities/category.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Cron, CronExpression } from '@nestjs/schedule';
import { deleteImage } from "src/helpers/file-helper";

@Injectable()
export class MenuService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    private readonly dataSource: DataSource
  ) { }

  async get(limit?: number) {
    const menuData = await this.redis.get('menu');
    const menu = await JSON.parse(menuData);
    console.log(menu, menu.itemCategories);

    const activeMenu = await this.removeInactiveProducts(menu.itemCategories);

    if (limit) {
      activeMenu.forEach(category => {
        category.items = randomSelection(category.items, limit);
      });
    }

    return { ...menu, itemCategories: activeMenu };
  }

  async searchMeals(search: string) {
    if (search === '') throw new BadRequestException('Search value is not valid.')

    let result = [];
    const menu = await this.get();
    for (let i = 0; i < menu.itemCategories.length; i++) {
      const category = menu.itemCategories[i];
      for (let k = 0; k < category.items.length; k++) {
        const item = category.items[k];
        if (item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
          result.push(item);
        }
      }
    }

    if (result.length === 0) throw new NotFoundException('Nothing is found in menu.');
    return result;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async fetch() {
    return await backupMenu(this.redis)
      .then(async (menuResponse: BackupResponse) => {
        if (menuResponse) {
          await this.saveMenu(menuResponse);
          return { message: 'Successfully updated whole menu' };
        }
        else {
          console.log('error while doing backup.');
          backupMenu(this.redis);

          return { message: 'Failed to update menu' };
        }
      })
      .catch(err => {
        backupMenu(this.redis);

        return { message: 'Failed to update menu' };
      });
  }

  async createProducts(categoryId: string, products: CreateProductDto[]) {
    const category = await this.categoriesRepository.findOneBy({ categoryId })
    const parseProducts = products.map(product => { return { ...product, category } })
    return this.insertOrIgnore<Product>(Product, parseProducts)
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.insertOrIgnore<Category>(Category, createCategoryDto);
  }

  async saveMenu(menuResponse: BackupResponse) {
    const parsedMenu = menuResponse.parsedMenu;
    if (parsedMenu && parsedMenu.length !== 0) {
      for (let i = 0; i < parsedMenu.length; i++) {
        const { name, categoryId, products } = parsedMenu[i];
        const category = await this.createCategory({ name, categoryId });
        if (category) {
          await this.createProducts(categoryId, products);
        }
      }
    }
  }

  async insertOrIgnore<T>(
    model: EntityTarget<T>,
    values: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]
  ) {
    const querryBuilder = this.dataSource
      .createQueryBuilder()
      .insert()
      .into(model)
      .values(values)

    const [sql, args] = querryBuilder.getQueryAndParameters();
    const nsql = sql.replace('INSERT INTO', 'INSERT IGNORE INTO');
    const query = await this.dataSource.manager.query(nsql, args);
    return query
  }

  async uploadImage(id: number, filename: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product is not found.');

    const imageUrl = product.imageUrl;
    if (imageUrl !== null) {
      deleteImage(imageUrl);
    }

    const updateResult = await this.productsRepository.update({ id }, { imageUrl: `images/products/${filename}` });
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not update the image');

    return { message: 'Image was successfully uploaded.' }
  }

  async changeActiveStatus(id: number, isActive: boolean) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product is not found.');

    const updateResult = await this.productsRepository.update({ id }, { isActive });
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not update the image');

    return { message: 'Successfully changed the active status of a product.' }
  }

  async removeInactiveProducts(categories: any[]) {
    const products = await this.productsRepository.find();

    const newCategories = categories.map(category => {
      const items = category.items;

      const newItems = (items.map((item: any) => {
        const product = products.find(product => product.itemId === item.itemId);
        return product.isActive ? {
          ...item,
          imageUrl: product.imageUrl
        } : null
      })).filter((item: any) => item !== null);

      return {
        ...category,
        items: newItems
      }
    })

    return newCategories;
  }
}
