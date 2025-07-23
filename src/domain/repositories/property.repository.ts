import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { PropertyType } from "../enums/property-type.enum";
import { ExploreMapDto } from "src/application/dtos/map/explore-map.dto";
import { Property } from "../entities/property.entity";

export const PROPERTY_REPOSITORY = 'PROPERTY_REPOSITORY';

export interface PropertyRepositoryInterface {
    findById(id: number);
    findPropertyDetailsById(propertyId: number,baseUrl: string,uesrId: number);
    findByIdWithOwner(propertyId: number);
    findRelatedProperties(id: number,baseUrl: string);
    createPropertyAndSaveIt(data: CreatePropertyDto);
    updateProperty(id: number,data: UpdatePropertyDto);
    findPropertiesByUserOffice(userId: number,baseUrl: string);
    findPropertiesByUserOfficeWithFilters(userId: number,filters: SearchPropertiesDto,baseUrl: string);
    findPropertyByPropertyIdAndUserOffice(userId: number,propertyId: number,baseUrl: string);
    searchPropertiesForOfficeByTitle(userId: number,title: string,baseUrl: string);
    findPropertyReservationDetails(id: number);
    getExpectedpPriceInRegion(propertyId: number);
    getAllProperties(baseUrl: string,page: number,items: number,userId: number);
    getAllPropertiesWithFilters(baseUrl: string, filters: PropertiesFiltersDto,page: number,items: number,userId: number);
    searchPropertyByTitle(title: string,baseUrl: string,page: number,items: number,userId: number);
    rateProperty(userId: number,propertyId: number,rate: number);
    compareTwoProperties(propertyId1: number,propertyId2: number,baseUrl: string);
    getTopRatedProperties(page: number,items: number,type: PropertyType,userId: number);
    findWithinBounds(bounds: ExploreMapDto);
    findOneByIdAndOffice(propertyId: number, officeId: number): Promise<Property | null>;
}