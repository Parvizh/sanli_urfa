import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FindVacanciesQuery, VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsAdminGuard } from "../auth/guards/is-admin.guard";

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) { }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Post()
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  async get(@Query() query: FindVacanciesQuery) {
    return this.vacanciesService.get(query);
  }

  @Get('one-vacancy/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.getById(id);
  }

  @Get('/:lang')
  async getByLang(@Param('lang') lang: string) {
    return this.vacanciesService.getByLang(lang);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.delete(id);
  }

  //Different get method for admin panel since AdminJs does not support nested entities
  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  async getAdminById(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.getVacancyInformationByIdAdminPanel(id);
  }
}