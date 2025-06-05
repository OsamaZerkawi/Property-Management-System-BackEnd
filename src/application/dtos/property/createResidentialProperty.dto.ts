import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Direction } from "src/domain/enums/direction.enum";
import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { RentDetailsDto } from "./rentDetails.dto";
import { SellDetailsDto } from "./sellDetails.dto";
import { RoomDetailsDto } from "./roomDetails.dto";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyType } from "src/domain/enums/property-type.enum";

export class CreateResidentialPropertyDto {
    @IsString()
    postTitle: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    @Type(() => Number)
    tags: number[];

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

    @IsBoolean()
    @Type(() => Boolean)
    has_furniture: boolean;

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