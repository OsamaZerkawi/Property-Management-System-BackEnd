import { IsDefined, IsDateString, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTouristicBookingDto {
  @IsDefined()
  @IsDateString()
  startDate: string;

  @IsDefined()
  @IsDateString()
  endDate: string;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  propertyId: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }) 
  @Min(0, { message: 'deposit يجب أن يكون >= 0' })
  deposit: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }) 
  @Min(0, { message: 'totalPrice يجب أن يكون >= 0' })
  totalPrice: number;

  @IsDefined()
  @IsString()
  payment_id: string;
}
