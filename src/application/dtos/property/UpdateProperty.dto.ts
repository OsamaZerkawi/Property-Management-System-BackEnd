import { Office } from "src/domain/entities/offices.entity";
import { Region } from "src/domain/entities/region.entity";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { RoomDetailsDto } from "./roomDetails.dto";

export class UpdatePropertyDto {
 office?: Office;
 region?: Region;
 property_type?: PropertyType;
 floor_number?: number;
 latitude?: number;
 longitude?: number;
 area?: number;
 has_furniture?: boolean;
 room_details?: RoomDetailsDto;
}