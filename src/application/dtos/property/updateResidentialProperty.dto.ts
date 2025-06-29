import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { Direction } from "src/domain/enums/direction.enum";
import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { RentDetailsDto } from "./rentDetails.dto";
import { SellDetailsDto } from "./sellDetails.dto";
import { RoomDetailsDto } from "./roomDetails.dto";
import { ListingType } from "src/domain/enums/listing-type.enum";

export class UpdateResidentialPropertyDto {
    @IsString()
    @IsOptional()
    postTitle?: string;

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
    @IsBoolean()
    has_furniture?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => RoomDetailsDto)
    room_details?: RoomDetailsDto;
    
    @IsOptional()
    @ValidateNested()
    @Type(() => RentDetailsDto)
    @IsOptional()
    rent_details?: RentDetailsDto;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => SellDetailsDto)
    @IsOptional()
    sell_details?: SellDetailsDto;

    @IsEnum(ListingType)
    @IsOptional()
    listing_type: ListingType;
}