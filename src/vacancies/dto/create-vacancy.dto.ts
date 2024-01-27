import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateVacancyDto {
    @IsString({ message: 'vacancy must be a string' })
    @IsNotEmpty({ message: 'vacancy is missing' })
    vacancy: string;

    @IsString({ message: 'location must be a string' })
    @IsNotEmpty({ message: 'location is missing' })
    location: string;

    @IsArray({ message: 'information should be provided as array of strings' })
    @IsNotEmpty({ message: 'information is missing', each: true })
    @ArrayNotEmpty({ message: 'information is missing' })
    information: string[];

    @IsArray({ message: 'requirementes should be provided as array of strings' })
    @IsNotEmpty({ message: 'requirements are missing', each: true })
    @ArrayNotEmpty({ message: 'requirements are missing' })
    requirements: string[];

    @IsString({ message: 'lang must be a string' })
    @IsNotEmpty({ message: 'lang is missing' })
    lang: string;

    @IsDateString({ message: 'expiresAt must be a type of date' })
    @IsNotEmpty({ message: 'expirestAt is missing' })
    expiresAt: string;
}
