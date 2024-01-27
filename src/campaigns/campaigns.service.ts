import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { DeleteResult, Repository, EntityNotFoundError, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindCampaignsQuery } from './campaigns.controller';
import { deleteImage } from 'src/helpers/file-helper';
import { UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class CampaignsService {
  constructor(@InjectRepository(Campaign) private readonly campaignsRepository: Repository<Campaign>) { }

  async getById(id: number) {
    const campaign = await this.campaignsRepository.findOneBy({ id });
    if (!campaign) throw new NotFoundException('Campaign is not found');

    return campaign;
  }

  async get(query: FindCampaignsQuery) {
    const options = {};
    if (query.limit) options['take'] = query.limit;

    const campaigns = await this.campaignsRepository.find(options);
    if (!campaigns || (Array.isArray(campaigns) && campaigns.length === 0)) throw new NotFoundException('Campaigns are not found.');

    return campaigns;
  }

  async add(filename: string) {
    if (!filename) throw new UnprocessableEntityException('Could not upload image, please provide image with .jpg, .jpeg, .png extensions');
    const campaign = this.campaignsRepository.create({
      imageUrl: `images/campaigns/${filename}`
    });
    const data = await this.campaignsRepository.save(campaign);
    if (!data) throw new BadRequestException('Could not create a campaign.');

    return data;
  }

  async update(id: number, fileName: string) {
    if (!fileName) throw new UnprocessableEntityException('Could not upload image, please provide image with .jpg, .jpeg, .png extensions');
    try {
      const campaing = await this.getById(id);
      deleteImage(campaing.imageUrl);
      const updatedResult: UpdateResult = await this.campaignsRepository.update({ id }, { imageUrl: `images/campaigns/${fileName}` });

      return { message: 'Successfully updated a campaign' };
    } catch (error) {
      if (error instanceof EntityNotFoundError || error instanceof NotFoundException) {
        throw new NotFoundException('Campaign is not found, could not update.');
      } else {
        throw error;
      }
    }
  }

  async delete(id: number) {
    try {
      const campaignsResponse = await this.getById(id);
      deleteImage(campaignsResponse.imageUrl);
      const deleteResult: DeleteResult = await this.campaignsRepository.delete(id);
      return { message: 'Successfully deleted a campaign' };
    } catch (error) {
      if (error instanceof EntityNotFoundError || error instanceof NotFoundException) {
        throw new NotFoundException('Campaign is not found, could not delete.');
      } else {
        throw error;
      }
    }
  }
}
