import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateVacancyDto } from "./dto/create-vacancy.dto";
import { UpdateVacancyDto } from "./dto/update-vacancy.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, QueryRunner, Repository } from "typeorm";
import { Vacancy } from "./entities/vacancy.entity";
import { VacancyRequirement } from "./entities/vacancy-requirement.entity";
import { VacancyInformation } from "./entities/vacancy-information.entity";

export type FindVacanciesQuery = {
  limit?: number
}

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy) private readonly vacanciesRepository: Repository<Vacancy>,
    @InjectRepository(VacancyRequirement) private readonly vacanciesRequirementRepository: Repository<VacancyRequirement>,
    @InjectRepository(VacancyInformation) private readonly vacanciesInformationRepository: Repository<VacancyInformation>,
    private readonly connection: Connection
  ) { }

  async create(createVacancyDto: CreateVacancyDto) {
    const { information, requirements, ...rest } = createVacancyDto;
    const vacancy = this.vacanciesRepository.create(rest);

    return await this.saveData(vacancy, createVacancyDto.information, createVacancyDto.requirements);
  }

  async get(query: FindVacanciesQuery) {
    const options = {
      relations: {
        information: true,
        requirements: true
      }
    };
    if (query.limit) options['take'] = query.limit;

    const vacancies = await this.vacanciesRepository.find(options);
    if (!vacancies || (Array.isArray(vacancies) && vacancies.length === 0)) throw new NotFoundException('Vacancies are not found.');

    const currentDate = new Date();
    return vacancies.filter((vacancy: Vacancy) => new Date(vacancy.expiresAt) > currentDate);
  }

  async getById(id: number) {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id },
      relations: {
        requirements: true,
        information: true
      }
    });
    if (!vacancy) throw new NotFoundException('Vacancy is not found');

    const currentDate = new Date();
    if (new Date(vacancy.expiresAt) < currentDate) throw new BadRequestException('This vacancy is expired');

    return vacancy;
  }

  async getByLang(lang: string) {
    const vacancies = await this.vacanciesRepository.find({
      where: { lang },
      relations: {
        requirements: true,
        information: true
      }
    });
    if (!vacancies || (Array.isArray(vacancies) && vacancies.length === 0)) throw new NotFoundException('Vacancies are not found');

    const currentDate = new Date();
    return vacancies.filter((vacancy: Vacancy) => new Date(vacancy.expiresAt) > currentDate);
  }

  async update(id: number, updateVacancyDto: UpdateVacancyDto) {
    const { information, requirements, ...rest } = updateVacancyDto;
    const vacancy = await this.getById(id);
    if (!vacancy) throw new NotFoundException('Vacancy is not found, could not update');

    if (Object.keys(rest).length !== 0) {
      await this.vacanciesRepository.update({ id }, rest);
    }

    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (information) {
        // await this.vacanciesInformationRepository.delete({ vacancy.id });
        await queryRunner.manager.delete(VacancyInformation, { vacancy });

        const createdInformation = this.createInformation(information, vacancy);
        await Promise.all(createdInformation.map((info) => queryRunner.manager.save(info)));
      }

      if (requirements) {
        await queryRunner.manager.delete(VacancyRequirement, { vacancy });

        const createdRequirements = this.createRequirements(requirements, vacancy);
        await Promise.all(createdRequirements.map((requirement) => queryRunner.manager.save(requirement)));
      }

      await queryRunner.commitTransaction();
      return { message: 'Successfully updated vacancy' }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number) {
    const deleteResult = await this.vacanciesRepository.delete({ id });
    if (!deleteResult.affected) throw new NotFoundException('Vacancy is not found, could not delete');

    return { message: 'Successfully deleted a vacancy' }
  }

  async saveData(vacancy: Vacancy, information: string[], requirements: string[]) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedVacancy = await queryRunner.manager.save(vacancy);
      const createdInformation = this.createInformation(information, vacancy);
      const createdRequirements = this.createRequirements(requirements, vacancy);

      const savedRequirements = await Promise.all(createdRequirements.map(async (requirement) => {
        await queryRunner.manager.save(requirement);
        delete requirement.vacancy;

        return requirement;
      }));
      const savedInformation = await Promise.all(createdInformation.map(async (info) => {
        await queryRunner.manager.save(info);
        delete info.vacancy;

        return info;
      }));

      await queryRunner.commitTransaction();

      return {
        ...savedVacancy,
        requirements: savedRequirements,
        information: savedInformation
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private createRequirements(requirements: string[], vacancy: Vacancy) {
    return requirements.map((requirement) => this.vacanciesRequirementRepository.create({ requirement, vacancy }));
  }

  private createInformation(information: string[], vacancy: Vacancy) {
    return information.map((info) => this.vacanciesInformationRepository.create({
      information: info,
      vacancy
    }));
  }

  async getVacancyInformationByIdAdminPanel(id: number) {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id },
      relations: {
        requirements: true,
        information: true
      }
    });
    if (!vacancy) throw new NotFoundException('Vacancy is not found');

    return vacancy;
  }
}
