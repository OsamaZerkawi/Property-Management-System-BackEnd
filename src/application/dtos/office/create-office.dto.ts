import {
    IsString, IsEnum, IsBoolean, IsNumber, IsOptional,
    Matches, ValidateNested, ArrayNotEmpty
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { OfficeType } from 'src/domain/enums/office-type.enum';
  import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
  
  class SocialItem {
    @IsString() platform: string;
    @IsString() link: string;
  }
  
  export class CreateOfficeDto {  
    @IsString() name: string;
    @IsString() logo: string;
    @IsEnum(OfficeType) type: OfficeType;
    @IsNumber() commission: number;
    @IsNumber() booking_period: number;
    @IsNumber() deposit_per_m2: number;
    @IsNumber() tourism_deposit: number;
    @IsEnum(PaymentMethod) payment_method: PaymentMethod;
    @IsBoolean() active: boolean;
  
    // التحقق من تنسيق الوقت بصيغة 24 ساعة (HH:mm)
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'الوقت يجب أن يكون بصيغة HH:mm' })
    opening_time: string;
  
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'الوقت يجب أن يكون بصيغة HH:mm' })
    closing_time: string;
  
    @IsNumber() region_id: number;
  
    @ValidateNested({ each: true })
    @Type(() => SocialItem)
    @ArrayNotEmpty()
    socials: SocialItem[];
  }
  