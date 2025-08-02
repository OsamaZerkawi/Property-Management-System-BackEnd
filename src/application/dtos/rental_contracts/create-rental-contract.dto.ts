// src/application/dto/create-rental-contract.dto.ts
import { IsInt, IsDecimal, IsDateString, IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';

export class CreateRentalContractDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  monthlyRent: number;

  @IsInt()
  @IsNotEmpty()
  propertyId: number;

  @IsInt()
  @IsNotEmpty()
  residentialId: number;
 
}