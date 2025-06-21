import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";

export const PROPERTY_REPOSITORY = 'PROPERTY_REPOSITORY';

export interface PropertyRepositoryInterface {
    findById(id: number);
    findPropertyDetailsById(propertyId: number,baseUrl: string);
    findByIdWithOwner(propertyId: number);
    createPropertyAndSaveIt(data: CreatePropertyDto);
    updateProperty(id: number,data: UpdatePropertyDto);
    findPropertiesByUserOffice(userId: number,baseUrl: string);
    findPropertiesByUserOfficeWithFilters(userId: number,filters: SearchPropertiesDto,baseUrl: string);
    findPropertyByPropertyIdAndUserOffice(userId: number,propertyId: number,baseUrl: string);
    searchPropertiesForOfficeByTitle(userId: number,title: string,baseUrl: string);
    findPropertyReservationDetails(id: number);
    getExpectedpPriceInRegion(propertyId: number);
    getAllProperties(baseUrl: string,page: number,items: number);
    getAllPropertiesWithFilters(baseUrl: string, filters: PropertiesFiltersDto,page: number,items: number);
    searchPropertyByTitle(title: string,baseUrl: string,page: number,items: number);
}