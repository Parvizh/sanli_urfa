import { Injectable, NotFoundException, NotImplementedException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { Connection, QueryRunner, Repository } from "typeorm";
import { CreateNewsDto, CreateMultiLanguageNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { deleteImage } from "../helpers/file-helper";
import { NewsTranslation } from "./entities/news-translation.entity";

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    @InjectRepository(NewsTranslation) private readonly newsTranslationRepository: Repository<NewsTranslation>,
    private readonly connection: Connection
  ) { }

  async create(file: Express.Multer.File, createNewsDto: CreateNewsDto) {
    if (!file) throw new UnprocessableEntityException('The uploaded file should be of type jpg, jpeg or png');

    const { date } = createNewsDto;
    const newsData = { date, imageUrl: `images/news/${file.filename}` };
    const news = this.newsRepository.create(newsData);

    return await this.saveData(news, createNewsDto.translations);
  }

  async get(lang: string, limit: number) {
    let query =
      this.newsRepository
        .createQueryBuilder('news')
        .leftJoin('news.translations', 'translations', 'translations.newsId = news.id')
        .where('translations.lang = :lang', { lang })
        .select(['news.id', 'news.imageUrl', 'news.date', 'translations.title', 'translations.description'])
        .orderBy('news.date', 'DESC');

    if (limit) query = query.take(limit);

    const data: any = await query.getMany();
    if (!data || data.length === 0) throw new NotImplementedException('Could not fetch news');

    return data;
  }

  async getById(lang: string, id: number) {
    const data =
      await this.newsRepository
        .createQueryBuilder('news')
        .leftJoinAndSelect('news.translations', 'translations', 'translations.newsId = :id', { id })
        .where('translations.lang = :lang', { lang })
        .getOne();

    if (data) return data;
    else throw new NotFoundException('News not found!');
  }

  async update(id: number, file: Express.Multer.File, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) throw new NotFoundException('News is not found, could not update');
    const oldImage = news.imageUrl;

    let updatedNewsData: { date?: Date, imageUrl?: string };
    if (file) updatedNewsData = { date: updateNewsDto.date, imageUrl: `images/news/${file.filename}` };
    else updatedNewsData = { date: updateNewsDto.date };

    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (Object.keys(updatedNewsData).length !== 0) {
        Object.assign(news, updatedNewsData);
        const data = await this.newsRepository.save(news);
        if (!data) throw new NotImplementedException();
      }

      if (updateNewsDto.translations) {
        // await this.newsTranslationRepository.delete({ news });
        await queryRunner.manager.delete(NewsTranslation, { news });

        const createdTranslations = this.createTranslations(updateNewsDto.translations, news);
        const data = await Promise.all(createdTranslations.map((translation) => queryRunner.manager.save(translation)));
        if (!data) throw new NotImplementedException();
      }

      if (file && oldImage) deleteImage(oldImage);

      await queryRunner.commitTransaction();

      return { message: 'Successfully updated news' }
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotImplementedException) return { message: "Could not update news" };
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number) {
    const news = await this.newsRepository.findOneBy({ id });
    const data = await this.newsRepository.remove(news);

    if (data) {
      if (news.imageUrl) deleteImage(news.imageUrl);

      return { message: 'Successfully deleted news' };
    }
    else throw new NotImplementedException('Could not delete news');
  }

  async saveData(news: News, translations: CreateMultiLanguageNewsDto[]) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedNews = await queryRunner.manager.save(news);
      const createdTranslations = this.createTranslations(translations, news);

      const savedTranslations = await Promise.all(createdTranslations.map(async (translation) => {
        await queryRunner.manager.save(translation);
        delete translation.news;

        return translation;
      }));

      await queryRunner.commitTransaction();

      return {
        ...savedNews,
        translations: savedTranslations
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private createTranslations(translations: CreateMultiLanguageNewsDto[], news: News) {
    return translations.map((translation) => this.newsTranslationRepository.create({ ...translation, news }));
  }

  async getNewsInformationByIdAdminPanel(id: number) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: {
        translations: true
      }
    });
    if (!news) throw new NotFoundException('News is not found');

    return news;
  }
}