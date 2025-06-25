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

export class ResidentialPropertiesSearchFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  regionId?: number;

  @IsOptional()
  @IsEnum(ListingType)
  listing_type?: ListingType;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  minArea?: number;

  @IsOptional()
  @IsNumber()
  maxArea?: number;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
  
  @IsOptional()
  @IsBoolean()
  has_furniture?: boolean;

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @IsOptional()
  @IsEnum(OwnershipType)
  ownership_type?: OwnershipType;

  @IsOptional()
  @IsNumber()
  floor_number?: number;

  @IsOptional()
  @IsEnum(PropertyPostTag)
  tag?: PropertyPostTag

  @IsOptional()
  @ValidateNested()
  @Type(() => RoomDetailsDto)
  room_details?: RoomDetailsDto;    
}