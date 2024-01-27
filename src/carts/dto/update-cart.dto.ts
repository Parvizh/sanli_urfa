import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCartDto {

    @IsNotEmpty({ message: 'meal is missing' })
    @IsArray({ message: 'items must be an array' })
    items: Meal[];

    @IsNotEmpty({ message: 'totalPrice is missing' })
    @Type(() => Number)
    @IsNumber({}, { message: 'totalPrice must be a number' })
    totalPrice: number;

    @IsNotEmpty({ message: 'totalAmount is missing' })
    @Type(() => Number)
    @IsInt({ message: 'totalAmount must be an integer' })
    totalAmount: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'addressId must be an integer' })
    addressId: number;
}

export class Meal {
    @IsNotEmpty({ message: 'name is missing' })
    @Type(() => String)
    @IsString({ message: 'name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'image is missing' })
    @Type(() => String)
    @IsString({ message: 'image must be a string' })
    image: string;

    @IsNotEmpty({ message: 'amount is missing' })
    @Type(() => Number)
    @IsInt({ message: 'amount must be an integer' })
    amount: number;

    @IsNotEmpty({ message: 'price is missing' })
    @Type(() => Number)
    @IsNumber({}, { message: 'price must be a number' })
    price: number;

    @IsOptional()
    @Type(() => Array)
    @IsArray({ message: 'addititons must be an array' })
    additions: any[];

    @IsOptional()
    @Type(() => String)
    @IsString({ message: 'description must be a string' })
    description: string;
}