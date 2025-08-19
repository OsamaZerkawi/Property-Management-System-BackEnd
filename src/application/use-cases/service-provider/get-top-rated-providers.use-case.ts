import { Inject } from "@nestjs/common";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

export class GetTopRatedServiceProvidersUseCase{
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(page: number,items: number,baseUrl: string){
        const rawData =  await this.serviceProviderRepo.findTopRatedServiceProviders(page,items);

        const data = rawData.map((item) => ({
          id: item.id,
          name: item.name,
          logo: item.logo ? `${baseUrl}/uploads/providers/logo/${item.logo}` : null,
          career: item.career,
          location: item.location,
          rate: parseFloat(item.avg_rate),
          rating_count: parseInt(item.rating_count),
        }));
    
        const total = rawData.length > 0 ? parseInt(rawData[0].total_count) : 0;
        return [ data, total ];
    }
}