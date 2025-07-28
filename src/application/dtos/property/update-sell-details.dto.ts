import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateSellDetailsDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  selling_price?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  installment_allowed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  installment_duration?: number;
}