import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import { UpdateContactInfoDto } from "./update-contact-info.dto";

export class CreateContactInfoDto {
  @IsString()
  @IsNotEmpty()
  lang: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateContactInfoDto)
  contacts: Object;
}