import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, Min } from "class-validator";

export class SellDetailsDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  selling_price: number;

  @IsBoolean()
  @Type(() => Boolean)
  installment_allowed: boolean;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  installment_duration: number;
}