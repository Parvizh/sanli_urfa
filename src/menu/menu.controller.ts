import { Controller, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe, UseInterceptors, UploadedFile, UnprocessableEntityException, ParseIntPipe, Body } from "@nestjs/common";
import { MenuService } from './menu.service';
import { AuthGuard } from "@nestjs/passport";
import { IsAdminGuard } from "../auth/guards/is-admin.guard";
import { LimitDto } from "./dto/limit.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Get('/')
  async get(@Query(new ValidationPipe()) query: LimitDto) {
    return await this.menuService.get(query.limit);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  async fetch() {
    return await this.menuService.fetch();
  }

  @Get('/search=:search')
  async searchMeals(@Param('search') search: string) {
    return await this.menuService.searchMeals(search);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/image/upload/:id')
  uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() image: Express.Multer.File) {
    if (!image) throw new UnprocessableEntityException('Could not upload an image');
    return this.menuService.uploadImage(id, image.filename);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Patch('active-status/:id')
  changeActiveStatus(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.menuService.changeActiveStatus(id, updateProductDto.isActive);
  }

}
