import { Controller, Get, Post, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FindSliderImageQuery, SliderImagesService } from './slider-images.service';
import { Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';

@Controller('slider-images')
export class SliderImagesController {
  constructor(private readonly sliderImageService: SliderImagesService) { }

  @Get()
  get(@Query() query: FindSliderImageQuery) {
    return this.sliderImageService.get(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.sliderImageService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('sliderImage'))
  add(@UploadedFile() file: Express.Multer.File) {
    return this.sliderImageService.add(file.filename);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('sliderImage'))
  update(@UploadedFile() file: Express.Multer.File, @Param('id', ParseIntPipe) id: number) {
    return this.sliderImageService.update(id, file.filename);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.sliderImageService.delete(id);
  }
}
