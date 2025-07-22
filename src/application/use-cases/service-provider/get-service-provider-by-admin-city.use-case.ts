import { aq } from "@faker-js/faker/dist/airline-CLphikKp";
import { Inject, Injectable } from "@nestjs/common";
import { City } from "src/domain/entities/city.entity";
import { ADMIN_CITY_REPOSITORY, AdminCityRepositoryInterface } from "src/domain/repositories/admin-city.repository";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";

@Injectable()
export class GetServiceProvidersByAdminCityUseCase {
    constructor(
        @Inject(ADMIN_CITY_REPOSITORY)
        private readonly adminCityRepo: AdminCityRepositoryInterface,
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
    ){}

    async execute(userId: number,baseUrl: string){
        const adminCity = await this.adminCityRepo.findCityIdByUserId(userId);

        if(adminCity){
            return this.serviceProviderRepo.findAllByCityId(adminCity,baseUrl);
        }else{
            return this.serviceProviderRepo.findAll(baseUrl);
        }
    }
}