import {
  Body,
  Controller, Delete,
  Get, Param, ParseIntPipe, Patch,
  Post, Query,
  UploadedFile, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { IsAdminGuard } from "../auth/guards/is-admin.guard";
@ApiBearerAuth('access-token')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post('/')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @UseInterceptors(FileInterceptor('newsImage'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(file, createNewsDto);
  }

  @Get('/:lang')
  get(@Param('lang') lang: string, @Query() query) {
    return this.newsService.get(lang, parseInt(query.limit));
  }

  @Get('/:lang/:id')
  getById(@Param('lang') lang: string, @Param('id', ParseIntPipe) id: number) {
    return this.newsService.getById(lang, id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @UseInterceptors(FileInterceptor('newsImage'))
  update(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, file, updateNewsDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.delete(id);
  }

  @Get('panel/admin/:id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  async getAdminById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.getNewsInformationByIdAdminPanel(id);
  }

}