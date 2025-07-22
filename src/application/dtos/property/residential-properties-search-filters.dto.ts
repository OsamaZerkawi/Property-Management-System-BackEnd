import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsSemVer,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { Direction } from 'src/domain/enums/direction.enum';
import { OwnershipType } from 'src/domain/enums/ownership-type.enum';
import { RoomDetailsDto } from './roomDetails.dto';
import { PropertyStatus } from 'src/domain/enums/property-status.enum';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyFurnishingType } from 'src/domain/enums/property-furnishing-type.enum';

export class ResidentialPropertiesSearchFiltersDto {
  @ApiPropertyOptional({ description: 'رقم المنطقة', example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  regionId?: number;

  @ApiPropertyOptional({ enum: ListingType, description: 'نوع الإدراج (بيع أو أجار)' })
  @IsOptional()
  @IsEnum(ListingType)
  listing_type?: ListingType;

  @ApiPropertyOptional({ description: 'السعر الأدنى', example: 100000 })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'السعر الأعلى', example: 500000 })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'المساحة الدنيا بالمتر المربع', example: 50 })
  @IsOptional()
  @IsNumber()
  minArea?: number;

  @ApiPropertyOptional({ description: 'المساحة القصوى بالمتر المربع', example: 200 })
  @IsOptional()
  @IsNumber()
  maxArea?: number;

  @ApiPropertyOptional({ enum: PropertyStatus, description: 'حالة العقار' })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({ description: 'هل يحتوي على أثاث؟', example: true })
  @IsOptional()
  @IsEnum(PropertyFurnishingType)
  has_furniture?: PropertyFurnishingType;

  @ApiPropertyOptional({ enum: Direction, description: 'اتجاه العقار' })
  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @ApiPropertyOptional({ enum: OwnershipType, description: 'نوع الملكية' })
  @IsOptional()
  @IsEnum(OwnershipType)
  ownership_type?: OwnershipType;

  @ApiPropertyOptional({ description: 'رقم الطابق', example: 2 })
  @IsOptional()
  @IsNumber()
  floor_number?: number;

  @ApiPropertyOptional({ enum: PropertyPostTag, description: 'نوع العقار (شقة، فيلا، ...)' })
  @IsOptional()
  @IsEnum(PropertyPostTag)
  tag?: PropertyPostTag;

  @ApiPropertyOptional({ type: () => RoomDetailsDto, description: 'تفاصيل الغرف' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RoomDetailsDto)
  room_details?: RoomDetailsDto;   
}