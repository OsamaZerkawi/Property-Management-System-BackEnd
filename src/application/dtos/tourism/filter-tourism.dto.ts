import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum UnifiedPropertyStatus {
  PENDING = 'قيد الانتظار',
  APPROVED = 'مقبول',
  REJECTED = 'مرفوض',
  AVAILABLE = 'متوفر',
  UNAVAILABLE = 'غير متوفر',
  RESERVED = 'محجوز',
  UNDER_MAINTENANCE = 'في الصيانة'
}

export class FilterTourismDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsEnum(UnifiedPropertyStatus)
  status?: UnifiedPropertyStatus;
}