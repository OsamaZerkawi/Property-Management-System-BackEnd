// presentation/http/dtos/create-touristic-booking.dto.ts
import { IsDefined, IsNumber, IsString, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTouristicBookingDto {
  @IsDefined()
  @Type(() => String)
  @IsDateString()
  startDate: string;

  @IsDefined()
  @Type(() => String)
  @IsDateString()
  endDate: string;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  propertyId: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'deposit يجب أن يكون >= 0' })
  deposit: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'totalPrice يجب أن يكون >= 0' })
  totalPrice: number;

  @IsDefined()
  @Type(() => String)
  @IsString() 
  payment_id: string;
}
