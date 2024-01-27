import { Module } from '@nestjs/common';
import { SliderImagesService } from './slider-images.service';
import { SliderImagesController } from './slider-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { imageFileFilter } from 'src/helpers/file-helper';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { SliderImage } from './entities/slider-image.entity';
import { storeImage } from 'src/helpers/file-helper';

@Module({
  controllers: [SliderImagesController],
  providers: [SliderImagesService],
  imports: [
    TypeOrmModule.forFeature([SliderImage]),
    MulterModule.register({
      dest: './public/images',
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './public/images/slider-images',
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
          storeImage(req, file, callback);
        }
      })
    })
  ]
})
export class SliderImagesModule { }
