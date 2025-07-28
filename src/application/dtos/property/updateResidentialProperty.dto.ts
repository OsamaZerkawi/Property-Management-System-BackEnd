import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { Direction } from "src/domain/enums/direction.enum";
import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { RentDetailsDto } from "./rentDetails.dto";
import { SellDetailsDto } from "./sellDetails.dto";
import { RoomDetailsDto } from "./roomDetails.dto";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyFurnishingType } from "src/domain/enums/property-furnishing-type.enum";
import { RoomDetailsSearchDto } from "./room-details-search.dto";
import { UpdateRentDetailsDto } from "./update-rent-details.dto";
import { UpdateSellDetailsDto } from "./update-sell-details.dto";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";

export class UpdateResidentialPropertyDto {
    @IsEnum(PropertyPostTag)
    @IsOptional()
    postTag?: PropertyPostTag;

    @IsString()
    @IsOptional()
    postDescription?: string;

    @IsInt()
    @IsOptional()
    regionId?: number;

    @IsNumber()
    @IsOptional()
    floor_number?: number;

    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsNumber()
    @IsOptional()
    area?: number;

    @IsOptional()
    @IsEnum(OwnershipType)
    ownership_type?: OwnershipType;

    @IsOptional()
    @IsEnum(Direction)
    direction?: Direction;

    @IsOptional()
    @IsEnum(PropertyFurnishingType)
    has_furniture?: PropertyFurnishingType;

    @IsOptional()
    @ValidateNested()
    @Type(() => RoomDetailsSearchDto)
    room_details?: RoomDetailsSearchDto;
    
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateRentDetailsDto)
    @IsOptional()
    rent_details?: UpdateRentDetailsDto;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateSellDetailsDto)
    @IsOptional()
    sell_details?: UpdateSellDetailsDto;

    @IsEnum(ListingType)
    @IsOptional()
    listing_type?: ListingType;

    @IsEnum(PropertyStatus)
    @IsOptional()
    status?: PropertyStatus;
}