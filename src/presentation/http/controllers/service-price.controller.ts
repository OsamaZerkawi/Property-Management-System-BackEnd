import { Controller, Get, Query } from '@nestjs/common';
import { GetServicePriceUseCase } from 'src/application/use-cases/get-service-price.use-case';

@Controller('service-prices')
export class ServicePriceController {
  constructor(private readonly getPriceUseCase: GetServicePriceUseCase) {}

  @Get()
  async getPrice(@Query('service') service: string) {
    const price = await this.getPriceUseCase.execute(service);
    return { service, price };
  }
}