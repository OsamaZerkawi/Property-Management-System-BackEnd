import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { Residential } from "../entities/residential.entity";
import { PropertyStatus } from "../enums/property-status.enum";

export const RESIDENTIAL_PROPERTY_REPOSITORY ='RESIDENTIAL_PROPERTY_REPOSITORY';

export interface ResidentialPropertyRepositoryInterface{
  createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto);
  updateResidentialProperty(propertyId: number,data: UpdateResidentialPropertyDetailsDto);
  updateStatusOfProperty(propertyId: number, status: PropertyStatus);
  searchFilteredResidentialsProperties(baseUrl: string,filters: ResidentialPropertiesSearchFiltersDto,page: number,items: number,userId: number);
  findById(id: number);
  findOneByPropertyId(propertyId: number): Promise<Residential|null> 
  findTopResidentialLocationsByOffice(officeId: number): Promise<string[]> 
  save(residential: Residential);
  createPurchaseWithInvoices(options: {
    userId: number;
    propertyId: number;
    deposit: number;
    totalPrice: number;
    paymentIntentId?: string | null;
    installment: boolean;
  }): Promise<void>; 
}