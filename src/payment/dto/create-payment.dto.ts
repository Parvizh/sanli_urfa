import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
  @IsString({ message: 'paymentType must be a string' })
  @IsNotEmpty({ message: 'paymentType is missing' })
  paymentType: 'Card' | 'Cash';

  @IsString({ message: 'language must be a string' })
  @IsOptional()
  language?: 'AZ' | 'RU' | 'EN';

  @IsDecimal({}, { message: 'amount must be a number' })
  @IsOptional()
  amount?: number;
}