import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, EntityNotFoundError, DeleteResult } from 'typeorm';
import { SliderImage } from './entities/slider-image.entity';
import { NotFoundException } from '@nestjs/common';
import { deleteImage } from 'src/helpers/file-helper';

export type FindSliderImageQuery = { limit: number }

@Injectable()
export class SliderImagesService {
  constructor(@InjectRepository(SliderImage) private readonly sliderImageRepository: Repository<SliderImage>) { }

  async getById(id: number) {
    const sliderImage = await this.sliderImageRepository.findOneBy({ id });
    if (!sliderImage) throw new NotFoundException('Slider image is not found');

    return sliderImage;
  }

  async get(query: FindSliderImageQuery) {
    const options = {};
    if (query.limit) options['take'] = query.limit;

    const sliderImages = await this.sliderImageRepository.find(options);
    if (!sliderImages || (Array.isArray(sliderImages) && sliderImages.length === 0)) throw new NotFoundException('Slider images are not found.');

    return sliderImages;
  }

  async add(filename: string) {
    if (!filename) throw new UnprocessableEntityException('Could not upload image, please provide image with .jpg, .jpeg, .png extensions');
    const campaign = this.sliderImageRepository.create({
      imageUrl: `images/slider-images/${filename}`
    });
    const data = await this.sliderImageRepository.save(campaign);
    if (!data) throw new BadRequestException('Could not create a campaign.');

    return data;
  }

  async update(id: number, fileName: string) {
    if (!fileName) throw new UnprocessableEntityException('Could not upload image, please provide image with .jpg, .jpeg, .png extensions');
    try {
      const sliderImage = await this.getById(id);
      deleteImage(sliderImage.imageUrl);
      const updatedResult: UpdateResult = await this.sliderImageRepository.update({ id }, { imageUrl: `images/slider-images/${fileName}` });

      return { message: 'Successfully updated a slider image' };
    } catch (error) {
      if (error instanceof EntityNotFoundError || error instanceof NotFoundException) {
        throw new NotFoundException('Slider image is not found, could not update.');
      } else {
        throw error;
      }
    }
  }

  async delete(id: number) {
    try {
      const sliderImage = await this.getById(id);
      deleteImage(sliderImage.imageUrl);
      const deleteResult: DeleteResult = await this.sliderImageRepository.delete(id);
      return { message: 'Successfully deleted a slide image' };
    } catch (error) {
      if (error instanceof EntityNotFoundError || error instanceof NotFoundException) {
        throw new NotFoundException('Slider image is not found, could not delete.');
      } else {
        throw error;
      }
    }
  }
}
