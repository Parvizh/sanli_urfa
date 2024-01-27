import { PartialType } from '@nestjs/swagger';
import { CreateVacancyDto } from './create-vacancy.dto';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {
    @IsString({ message: 'vacancy must be a string' })
    @IsOptional()
    vacancy?: string;

    @IsString({ message: 'location must be a string' })
    @IsOptional()
    location?: string;

    @IsArray({ message: 'information should be provided as array of strings' })
    @IsOptional()
    information?: string[];

    @IsArray({ message: 'requirementes should be provided as array of strings' })
    @IsOptional()
    requirements?: string[];

    @IsString({ message: 'lang must be a string' })
    @IsOptional()
    lang?: string;

    @IsString({ message: 'expiresAt must be a type of string' })
    @IsOptional()
    expiresAt?: string;
}
