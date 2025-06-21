import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional } from "class-validator";
import { ListingType } from "src/domain/enums/listing-type.enum";

export class PropertiesFiltersDto {
    @IsNumber()
    @IsOptional()
    regionId?: number;
  
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    @IsNumber({}, { each: true })
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    tags?: number[];

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