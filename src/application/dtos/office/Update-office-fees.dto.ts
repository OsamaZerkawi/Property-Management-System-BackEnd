import { IsNumber, IsOptional } from "class-validator";

export class UpdateOfficeFeesDto {
    @IsNumber()
    @IsOptional()
    booking_period?: number;

    @IsNumber()
    @IsOptional()
    deposit_per_m2?: number;

    @IsNumber()
    @IsOptional()
    tourism_deposit_percentage?: number;
}