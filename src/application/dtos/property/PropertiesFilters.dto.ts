import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional } from "class-validator";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";

export class PropertiesFiltersDto {
    @IsNumber()
    @IsOptional()
    regionId?: number;
  
    @IsOptional()
    @IsEnum(PropertyPostTag)
    tag?:PropertyPostTag;

    @IsOptional()
    @IsEnum(ListingType)
    listing_type?: ListingType;

    @IsOptional()
    @IsBoolean()
    orderByArea?: boolean;
   
    @IsOptional()
    @IsBoolean()
    orderByPrice?: boolean;
   
    @IsOptional()
    @IsBoolean()
    orderByDate?: boolean;

}