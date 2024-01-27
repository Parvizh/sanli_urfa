import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from "class-validator";
import { plainToInstance, Transform, Type } from "class-transformer";
import { CreateMultiLanguageNewsDto } from "./create-news.dto";

export class UpdateNewsDto {
  @IsDateString()
  @IsOptional()
  date?: Date;
  
  @Type(() => CreateMultiLanguageNewsDto)
  @Transform((news) => plainToInstance(CreateMultiLanguageNewsDto, JSON.parse(news.value)))
  @IsOptional()
  @ValidateNested({ each: true})
  @IsArray()
  translations?: CreateMultiLanguageNewsDto[];
}