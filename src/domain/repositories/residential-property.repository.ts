import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { Residential } from "../entities/residential.entity";

export const RESIDENTIAL_PROPERTY_REPOSITORY ='RESIDENTIAL_PROPERTY_REPOSITORY_INTERFACE';

export interface ResidentialPropertyRepositoryInterface{
    createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto);
    updateResidentialProperty(id: number,data: UpdateResidentialPropertyDetailsDto);
    searchFilteredResidentialsProperties(baseUrl: string,filters: ResidentialPropertiesSearchFiltersDto,page: number,items: number,userId: number);
    findById(id: number);
    findOneByPropertyId(propertyId: number): Promise<Residential|null> 
}