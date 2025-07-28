
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";

export class UpdateRentDetailsDto {
  @IsEnum(RentalPeriod)
  @IsOptional()
  rental_period?: RentalPeriod;

  @IsOptional()
  @IsNumber()
  rentalPrice?: number;
}
