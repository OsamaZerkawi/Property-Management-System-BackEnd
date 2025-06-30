import { ServiceProviderFeedbackDto } from "src/application/dtos/service-provider/service-provider-feedback.dto";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";

export const SERVICE_PROVIDER_REPOSITORY = 'SERVICE_PROVIDER_REPOSITORY'; 

export interface ServiceProviderRepositoryInterface{
    getAll(baseUrl: string,page?:number,items?: number);
    getAllWithFilters(baseUrl: string,filters: ServiceProviderFiltersDto,page?:number,items?: number);
    findTopRatedServiceProviders(page: number,items: number);
    searchByName(baseUrl: string,name: string,page?:number,items?: number);
    createOrUpdateFeedback(userId:number,serviceProviderId: number,data:ServiceProviderFeedbackDto);
}