import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional } from "class-validator";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { SortDirection } from "src/domain/enums/sort-direction.enum";

export class PropertiesFiltersDto {
    @IsNumber()
    @IsOptional()
    regionId?: number;

    @IsNumber()
    @IsOptional()
    cityId?: number;
  
    @IsOptional()
    @IsEnum(PropertyPostTag)
    tag?:PropertyPostTag;

    @IsOptional()
    @IsEnum(ListingType)
    listing_type?: ListingType;

    @IsOptional()
    @IsEnum(SortDirection)
    orderByArea?: SortDirection;
   
    @IsOptional()
    @IsEnum(SortDirection)
    orderByPrice?: SortDirection;
   
    @IsOptional()
    @IsEnum(SortDirection)
    orderByDate?: SortDirection;

}