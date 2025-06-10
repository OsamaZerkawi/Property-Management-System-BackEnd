import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";

export const RESIDENTIAL_PROPERTY_REPOSITORY ='RESIDENTIAL_PROPERTY_REPOSITORY_INTERFACE';

export interface ResidentialPropertyRepositoryInterface{
    createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto);
    updateResidentialProperty(id: number,data: UpdateResidentialPropertyDetailsDto);
    findById(id: number);
}