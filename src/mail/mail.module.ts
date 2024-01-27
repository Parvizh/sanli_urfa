import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Mail } from "./entities/mail.entity";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { cvFileFilter } from "src/helpers/file-helper";
import { diskStorage } from "multer";
import { storeImage } from "src/helpers/file-helper";

@Module({
  imports: [
    TypeOrmModule.forFeature([Mail]),
    MulterModule.register({
      fileFilter: cvFileFilter,
      dest: './public/cv',
      storage: diskStorage({
        destination: './public/cv',
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
          storeImage(req, file, callback);
        }
      })
    }),
    ConfigModule
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
