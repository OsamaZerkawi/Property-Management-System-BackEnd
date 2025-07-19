// src/application/dto/create-rental-contract.dto.ts
import { IsInt, IsDecimal, IsDateString, IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';

export class CreateRentalContractDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  monthlyRent: number;

  @IsString()
  @IsNotEmpty()
  documentImage: string;

  @IsInt()
  @IsNotEmpty()
  propertyId: number;

  @IsInt()
  @IsNotEmpty()
  residentialId: number;
 
}