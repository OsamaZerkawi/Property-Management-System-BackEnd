import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServicePrice } from "src/domain/entities/service-price.entity";
import { ServiceType } from "src/domain/enums/service-type.enum";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ServicePriceSeeder {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(ServicePrice)
        private readonly servicePriceRepo: Repository<ServicePrice>,
    ){}

    async seed(){

      await this.dataSource.query('TRUNCATE TABLE service_prices RESTART IDENTITY CASCADE');
      const data: Partial<ServicePrice>[] = [
          {service: ServiceType.IMAGE_AD,pricePerDay: 50,isActive: true},
          {service: ServiceType.PROMOTIONAL_AD,pricePerDay: 100,isActive: true},
      ];

      for( const item of data ) {
          const service = this.servicePriceRepo.create(item);
          await this.servicePriceRepo.save(service);
      }

      console.log('✅ Service Prices seeded successfully!');       
    }
}