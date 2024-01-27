import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsString({ message: 'city must be a string' })
    @IsOptional()
    city?: string;

    @IsString({ message: 'district must be a string' })
    @IsOptional()
    district?: string;

    @IsString({ message: 'avenue must be a string' })
    @IsOptional()
    avenue?: string;

    @IsNumber({}, { message: 'bulding must be a number' })
    @IsOptional()
    building?: number;

    @IsString({ message: 'block must be a string' })
    @IsOptional()
    block?: string;

    @IsNumber({}, { message: 'floor must be a number' })
    @IsOptional()
    floor?: number;

    @IsString({ message: 'description must be a string' })
    @IsOptional()
    description?: string;

    @IsNumber({}, { message: 'flat must be a number' })
    @IsOptional()
    flat?: number;

    @IsString({ message: 'title must be a string' })
    @IsOptional()
    title?: string;
}
