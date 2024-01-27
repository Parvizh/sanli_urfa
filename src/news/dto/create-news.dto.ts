import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { plainToInstance, Transform, Type } from "class-transformer";

export class CreateNewsDto {
  @IsDateString()
  @IsNotEmpty()
  date!: Date;

  @Type(() => CreateMultiLanguageNewsDto)
  @Transform((news) => plainToInstance(CreateMultiLanguageNewsDto, JSON.parse(news.value)))
  @ValidateNested({ each: true})
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  translations!: CreateMultiLanguageNewsDto[];
}

export class CreateMultiLanguageNewsDto {
  @IsString()
  @IsNotEmpty()
  lang!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}