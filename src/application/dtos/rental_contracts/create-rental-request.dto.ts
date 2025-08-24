// presentation/http/dtos/create-rental-request.dto.ts
import { IsDefined, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRentalRequestDto {
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  propertyId: number;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  periodCount: number; 

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  totalPrice: number;  

  @IsDefined()
  @IsString()
  paymentIntentId?: string;  
}
