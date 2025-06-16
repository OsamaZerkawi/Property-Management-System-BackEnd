import { Inject } from "@nestjs/common";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

export class GetAllServiceProvidersWithFiltersUseCase {
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(filters: ServiceProviderFiltersDto){
        return await this.serviceProviderRepo.getAllWithFilters(filters);
    }
}