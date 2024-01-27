import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateProductDto {
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}