import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";

export const SERVICE_PROVIDER_REPOSITORY = 'SERVICE_PROVIDER_REPOSITORY'; 

export interface ServiceProviderRepositoryInterface{
    getAll();
    getAllWithFilters(filters: ServiceProviderFiltersDto);
    findTopRatedServiceProviders(page: number,items: number);
    searchByName(name: string);
}