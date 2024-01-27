import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
    @IsString({ message: 'city must be a string' })
    @IsNotEmpty({ message: 'city is missing' })
    city: string;

    @IsString({ message: 'district must be a string' })
    @IsNotEmpty({ message: 'district is missing' })
    district: string;

    @IsString({ message: 'avenue must be a string' })
    @IsNotEmpty({ message: 'avenue is missing' })
    avenue: string;

    @IsNumber({}, { message: 'bulding must be a number' })
    @IsNotEmpty({ message: 'building is missing' })
    building: number;

    @IsString({ message: 'block must be a string' })
    @IsNotEmpty({ message: 'block is missing' })
    block: string;

    @IsNumber({}, { message: 'floor must be a number' })
    @IsNotEmpty({ message: 'number is missing' })
    floor: number;

    @IsString({ message: 'description must be a string' })
    @IsOptional()
    description?: string;

    @IsNumber({}, { message: 'flat must be a number' })
    @IsNotEmpty({ message: 'flat is missing' })
    flat: number;

    @IsString({ message: 'title must be a string' })
    @IsOptional()
    title: string;
}
