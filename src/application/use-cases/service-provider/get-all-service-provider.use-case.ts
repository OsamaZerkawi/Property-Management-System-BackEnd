import { Inject } from "@nestjs/common";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

export class GetAllServiceProvidersUseCase {
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(baseUrl: string,page?:number,items?: number){
        return await this.serviceProviderRepo.getAll(baseUrl,page,items);
    }
}