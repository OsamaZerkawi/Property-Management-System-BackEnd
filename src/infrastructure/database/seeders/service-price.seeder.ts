import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServicePrice } from "src/domain/entities/service-price.entity";
import { ServiceType } from "src/domain/enums/service-type.enum";
import { Repository } from "typeorm";

@Injectable()
export class ServicePriceSeeder {
    constructor(
        @InjectRepository(ServicePrice)
        private readonly servicePriceRepo: Repository<ServicePrice>,
    ){}

    async seed(){
        const data: Partial<ServicePrice>[] = [
            {service: ServiceType.IMAGE_AD,pricePerDay: 500,isActive: true},
            {service: ServiceType.PROMOTIONAL_AD,pricePerDay: 1500,isActive: true},
        ];

        for( const item of data ) {
            const service = this.servicePriceRepo.create(item);
            await this.servicePriceRepo.save(service);
        }

        console.log('✅ Service Prices seeded successfully!');       
    }
}