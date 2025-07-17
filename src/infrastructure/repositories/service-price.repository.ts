import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServicePriceRepository } from 'src/domain/repositories/service-price.repository';
import { ServicePrice } from 'src/domain/entities/service-price.entity';
import { ServiceType } from 'src/domain/enums/service-type.enum';

@Injectable()
export class ServicePriceRepository implements IServicePriceRepository {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly repo: Repository<ServicePrice>,
  ) {}

  async findPriceByService(service: ServiceType): Promise<number | null> {
    const entity = await this.repo.findOne({ where: { service, isActive: true } });
    return entity?.pricePerDay ?? null;
  }
}