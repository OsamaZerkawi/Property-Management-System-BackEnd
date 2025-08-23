// application/dtos/purchase/create-purchase.dto.ts
import { IsDefined, IsNumber, Min, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  propertyId: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deposit: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPrice: number;
 
  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsDefined()
  @IsBoolean()
  installment: boolean;
}
