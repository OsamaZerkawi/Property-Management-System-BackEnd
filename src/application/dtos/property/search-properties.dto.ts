import { ApiQuery } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { CombinedPropertyStatus } from "src/domain/enums/combined-property-status.enum";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
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
  @IsEnum(CombinedPropertyStatus)
  status?: CombinedPropertyStatus;

  @IsOptional()
  @IsEnum(PropertyPostTag)
  tag?: PropertyPostTag;

  
}