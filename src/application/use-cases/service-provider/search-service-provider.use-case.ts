import { Inject } from "@nestjs/common";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

export class SearchServiceProviderUseCase {
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(name: string,baseUrl: string,page?:number,items?: number){
        return await this.serviceProviderRepo.searchByName(baseUrl,name,page,items);
    }
}