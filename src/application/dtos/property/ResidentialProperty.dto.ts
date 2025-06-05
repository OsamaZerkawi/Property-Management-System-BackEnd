import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { RentDetailsDto } from "./rentDetails.dto";
import { SellDetailsDto } from "./sellDetails.dto";
import { Direction } from "src/domain/enums/direction.enum";
import { Property } from "src/domain/entities/property.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";

export class ResidentialPropertyDto {
    listingType: ListingType;
    property: Property;
    ownership_type: OwnershipType;
    direction: Direction;
    rent_details?: RentDetailsDto;
    sell_details?: SellDetailsDto;
}