import { IsArray, IsEnum, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";

export class SearchPropertiesDto {
  @IsOptional()
  @IsEnum(ListingType)
  listing_type?: ListingType;

  @IsOptional()
  @IsNumber()
  regionId?: number;

  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsArray()
  @IsNumber({},{each: true})
  tagIds: number[];
}