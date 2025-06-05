import { Region } from "src/domain/entities/region.entity";
import { RoomDetailsDto } from "./roomDetails.dto";
import { Office } from "src/domain/entities/offices.entity";
import { PropertyType } from "src/domain/enums/property-type.enum";

export class CreatePropertyDto {
  office: Office;
  region: Region;
  property_type: PropertyType
  floor_number: number;
  latitude: number;
  longitude: number;
  area: number;
  has_furniture: boolean;
  room_details: RoomDetailsDto;
}