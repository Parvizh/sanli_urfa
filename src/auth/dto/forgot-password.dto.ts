import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {

    @IsNotEmpty({ message: 'email is missing' })
    @Type(() => String)
    @IsEmail({}, { message: 'email is invalid' })
    email: string;
}