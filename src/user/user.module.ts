import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Role } from "../auth/entities/role.entity";
import { MulterModule } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/helpers/file-helper';
import { diskStorage } from 'multer';
import { storeImage } from 'src/helpers/file-helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    MulterModule.register({
      dest: './public/images',
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './public/images/avatars',
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
          storeImage(req, file, callback);
        }
      })
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
