import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";

export const PROPERTY_REPOSITORY = 'PROPERTY_REPOSITORY';

export interface PropertyRepositoryInterface {
    findByIdWithOwner(propertyId: number);
    createPropertyAndSaveIt(data: CreatePropertyDto);
    findPropertiesByUserOffice(userId: number,baseUrl: string);
    findPropertiesByUserOfficeWithFilters(userId: number,filters: SearchPropertiesDto,baseUrl: string);
}