// src/application/dtos/update-service-provider.dto.ts
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceProviderType } from 'src/domain/enums/service-provider-type.enum';
  
export class UpdateServiceProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  region_id?: number;
  
  @IsOptional()
  @Type(()=>Boolean)
  @IsBoolean()
  status?:boolean;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'الوقت يجب أن يكون بصيغة HH:mm' })
  opening_time?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'الوقت يجب أن يكون بصيغة HH:mm' })
  closing_time?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsEnum(ServiceProviderType)
  career?: ServiceProviderType;

  @IsOptional()
  @IsString()
  logo?: string; 
 
}
