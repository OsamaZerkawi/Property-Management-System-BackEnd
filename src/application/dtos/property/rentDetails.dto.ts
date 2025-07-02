import { IsEnum, IsNumber, Min } from "class-validator";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";

export class RentDetailsDto {
  @IsEnum(RentalPeriod)
  rental_period: RentalPeriod;

  @IsNumber()
  @Min(0)
  rentalPrice: number;
}
