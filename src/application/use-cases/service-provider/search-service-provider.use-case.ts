import { Inject } from "@nestjs/common";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

export class SearchServiceProviderUseCase {
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(name: string){
        return await this.serviceProviderRepo.searchByName(name);
    }
}