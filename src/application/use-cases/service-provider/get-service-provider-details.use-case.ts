import { Inject } from "@nestjs/common";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

export class GetServiceProviderDetailsUseCase {
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(id: number,baseUrl: string){
        return await this.serviceProviderRepo.findOneWithDetails(id,baseUrl);
    }
}