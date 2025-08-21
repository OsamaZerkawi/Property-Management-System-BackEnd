import { Transform, Type } from 'class-transformer';
import {
    IsString, IsEnum, IsBoolean, IsNumber, IsOptional,
    Matches, ValidateNested, ArrayNotEmpty,
    IsNotEmpty,
    IsArray
  } from 'class-validator';
  import { OfficeType } from 'src/domain/enums/office-type.enum';
  import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
  export class SocialItem {
    @IsNotEmpty()
    @IsNumber()
    id: number;
  
    @IsOptional()
    @IsString()
    link: string;
  }
  
 export class UpdateOfficeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string|null;

  @IsOptional()
  @IsEnum(OfficeType, { message: 'type must be one of the following values: touristic, residential, both' })
  type: OfficeType;

  @IsOptional()
  @IsNumber()
  commission: number;

  @IsOptional()
  @IsNumber()
  booking_period: number;

  @IsOptional()
  @IsNumber()
  deposit_per_m2: number;

  @IsOptional()
  @IsNumber()
  tourism_deposit: number;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'payment_method must be one of the following values: stripe, cash' })
  payment_method: PaymentMethod;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'الوقت يجب أن يكون بصيغة HH:mm' })
  opening_time: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'الوقت يجب أن يكون بصيغة HH:mm' })
  closing_time: string;

  @IsOptional()
  @IsNumber()
  region_id: number;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;
 

   @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialItem)
  @Transform(({ value }) => { 
    if (!value || value === '' || value === 'undefined' || value === 'null') {
      return [];
    } 
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);  
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
     
    if (typeof value === 'object' && !Array.isArray(value)) {
      return [value];
    } 
    if (Array.isArray(value)) {
      return value;
    }
    
    return [];
  })
  socials?: SocialItem[];
}
