import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";

export const RESIDENTIAL_PROPERTY_REPOSITORY_INTERFACE ='RESIDENTIAL_PROPERTY_REPOSITORY_INTERFACE';

export interface ResidentialPropertyRepositoryInterface{
    createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto);
}