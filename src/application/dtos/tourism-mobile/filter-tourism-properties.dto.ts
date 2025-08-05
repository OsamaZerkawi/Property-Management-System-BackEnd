import { IsOptional, IsInt, IsString, IsNumber, IsDateString } from 'class-validator';

export class FilterTourismPropertiesDto {
  @IsOptional() @IsInt() regionId?: number;
  @IsOptional() @IsInt() cityId?: number;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @IsNumber() minArea?: number;
  @IsOptional() @IsNumber() maxArea?: number;
  @IsOptional() @IsNumber() minPrice?: number;
  @IsOptional() @IsNumber() maxPrice?: number;
  @IsOptional() @IsDateString() fromDate?: string;
  @IsOptional() @IsDateString() toDate?: string;
}