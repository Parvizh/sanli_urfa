import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDeliveryDto {
    @IsString({ message: 'paymentType must be a string' })
    @Type(() => String)
    @IsNotEmpty({ message: 'PaymentType is missing' })
    paymentType!: 'Card' | 'Cash';

    @IsString({ message: 'paymentToken must be a string' })
    @IsOptional()
    paymentToken?: string;
}