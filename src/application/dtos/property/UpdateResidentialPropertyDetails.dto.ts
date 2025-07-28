import { Property } from "src/domain/entities/property.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { Direction } from "src/domain/enums/direction.enum";
import { UpdateRentDetailsDto } from "./update-rent-details.dto";
import { UpdateSellDetailsDto } from "./update-sell-details.dto";

export class UpdateResidentialPropertyDetailsDto {
    listingType?: ListingType;
    property?: Property;
    ownership_type?: OwnershipType;
    direction?: Direction;
    rent_details?: UpdateRentDetailsDto;
    sell_details?: UpdateSellDetailsDto;
}