import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { MulterModule } from "@nestjs/platform-express";
import { imageFileFilter, storeImage } from "../helpers/file-helper";
import { diskStorage } from "multer";
import { NewsTranslation } from "./entities/news-translation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([News, NewsTranslation]),
    MulterModule.register({
      dest: './public/images',
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './public/images/news',
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
          storeImage(req, file, callback);
        }
      })
    })
  ],
  controllers: [NewsController],
  providers: [NewsService]
})

export class NewsModule { }