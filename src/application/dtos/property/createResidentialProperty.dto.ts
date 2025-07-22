import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Direction } from "src/domain/enums/direction.enum";
import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { RentDetailsDto } from "./rentDetails.dto";
import { SellDetailsDto } from "./sellDetails.dto";
import { RoomDetailsDto } from "./roomDetails.dto";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { PropertyFurnishingType } from "src/domain/enums/property-furnishing-type.enum";

export class CreateResidentialPropertyDto {
    @IsString()
    postDescription: string;

    @IsEnum(PropertyPostTag)
    tag:PropertyPostTag;

    @IsInt()
    @Type(() => Number)
    regionId: number;


    @IsNumber()
    @Type(() => Number)
    floor_number: number;

    @IsNumber()
    @Type(() => Number)
    latitude: number;

    @IsNumber()
    @Type(() => Number)
    longitude: number;

    @IsNumber()
    @Type(() => Number)
    area: number;

    @IsEnum(OwnershipType)
    ownership_type: OwnershipType;

    @IsEnum(Direction)
    direction: Direction;

    @IsEnum(PropertyFurnishingType)
    has_furniture: PropertyFurnishingType;

    @ValidateNested()
    @Type(() => RoomDetailsDto)
    room_details: RoomDetailsDto;
    
    @ValidateNested()
    @Type(() => RentDetailsDto)
    @IsOptional()
    rent_details?: RentDetailsDto;
  
    @ValidateNested()
    @Type(() => SellDetailsDto)
    @IsOptional()
    sell_details?: SellDetailsDto;

    @IsEnum(ListingType)
    listing_type: ListingType;
}