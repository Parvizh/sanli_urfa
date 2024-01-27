import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty({ message: 'token is missing' })
    @Type(() => String)
    @IsUUID(4, { message: 'token must be uuid' })
    token: string;

    @IsNotEmpty({ message: 'password is missing' })
    @Type(() => String)
    @IsString({ message: 'password must be a string' })
    password: string;
}