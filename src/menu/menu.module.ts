import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/helpers/file-helper';
import { diskStorage } from 'multer';
import { storeImage } from 'src/helpers/file-helper';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    MulterModule.register({
      dest: './public/images',
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './public/images/products',
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
          storeImage(req, file, callback);
        }
      })
    })]
})
export class MenuModule { }
