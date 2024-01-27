import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { Campaign } from './entities/campaign.entity';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from "multer";
import { imageFileFilter, storeImage } from "../helpers/file-helper";

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService],
  imports: [
    TypeOrmModule.forFeature([Campaign]),
    MulterModule.register({
      dest: './public/images',
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './public/images/campaigns',
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
          storeImage(req, file, callback);
        }
      })
    })]
})
export class CampaignsModule { }
