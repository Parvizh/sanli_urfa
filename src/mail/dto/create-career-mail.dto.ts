import { IsNotEmpty, IsString } from "class-validator";

export class CreateCareerMailDto {
    @IsString({ message: 'fullName must be a string' })
    @IsNotEmpty({ message: 'fullName is missing' })
    fullName: string;

    @IsString({ message: 'phoneNumber must be a string' })
    @IsNotEmpty({ message: 'phoneNumber is missing' })
    phoneNumber: string;

    @IsString({ message: 'email must be a string' })
    @IsNotEmpty({ message: 'email is missing' })
    email: string;

    @IsString({ message: 'vacancy must be a string' })
    @IsNotEmpty({ message: 'vacancy is missing' })
    vacancy: string;
}