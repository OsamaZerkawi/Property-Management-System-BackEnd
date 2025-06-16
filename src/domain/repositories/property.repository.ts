import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";

export const PROPERTY_REPOSITORY = 'PROPERTY_REPOSITORY';

export interface PropertyRepositoryInterface {
    findById(id: number);
    findByIdWithOwner(propertyId: number);
    createPropertyAndSaveIt(data: CreatePropertyDto);
    updateProperty(id: number,data: UpdatePropertyDto);
    findPropertiesByUserOffice(userId: number,baseUrl: string);
    findPropertiesByUserOfficeWithFilters(userId: number,filters: SearchPropertiesDto,baseUrl: string);
    findPropertyByPropertyIdAndUserOffice(userId: number,propertyId: number,baseUrl: string);
    searchPropertiesByTitle(userId: number,title: string,baseUrl: string);
    findPropertyReservationDetails(id: number);
    getExpectedpPriceInRegion(propertyId: number);
}