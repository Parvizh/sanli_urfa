import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string
}