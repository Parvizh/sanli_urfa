import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateContactInfoDto {
  @IsOptional()
  mobile?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  working_hours?: string;
}
