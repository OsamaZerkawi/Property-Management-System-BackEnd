import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServicePriceRepository } from 'src/domain/repositories/service-price.repository';
import { ServicePrice } from 'src/domain/entities/service-price.entity';
import { ServiceType } from 'src/domain/enums/service-type.enum';
import { NotFoundError } from 'rxjs';
import { errorResponse } from 'src/shared/helpers/response.helper';

@Injectable()
export class ServicePriceRepository implements IServicePriceRepository {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly repo: Repository<ServicePrice>,
  ) {}

  async findPriceByService(service: ServiceType): Promise<number> {
    const entity = await this.repo.findOne({ where: { service, isActive: true } });
    
    const price = entity?.pricePerDay;
    if(!price){
      throw new NotFoundException(
        errorResponse('سعر الخدمة غير موجود',404)
      );
    }
    return  price;
  }
}