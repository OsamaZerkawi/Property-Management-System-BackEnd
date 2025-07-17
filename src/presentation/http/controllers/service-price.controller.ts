import { Controller, Get, Query } from '@nestjs/common';
import { GetServicePriceUseCase } from 'src/application/use-cases/get-service-price.use-case';
import { ServiceType } from 'src/domain/enums/service-type.enum';

@Controller('service-prices')
export class ServicePriceController {
  constructor(private readonly getPriceUseCase: GetServicePriceUseCase) {}

  @Get()
  async getPrice(@Query('service') service: ServiceType) {
    const price = await this.getPriceUseCase.execute(service);
    return { service, price };
  }
}