import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { VacancyInformation } from './entities/vacancy-information.entity';
import { VacancyRequirement } from './entities/vacancy-requirement.entity';

@Module({
  controllers: [VacanciesController],
  providers: [VacanciesService],
  imports: [TypeOrmModule.forFeature([Vacancy, VacancyInformation, VacancyRequirement])]
})
export class VacanciesModule { }
