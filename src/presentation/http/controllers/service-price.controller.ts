import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { GetServicePriceUseCase } from 'src/application/use-cases/get-service-price.use-case';
import { ServiceType } from 'src/domain/enums/service-type.enum';
import { successResponse } from 'src/shared/helpers/response.helper';
import { GetPriceSwaggerDoc } from '../swagger/service-price/get-price-for-service.swagger';

@Controller('service-prices')
export class ServicePriceController {
  constructor(private readonly getPriceUseCase: GetServicePriceUseCase) {}

  @Get()
  @GetPriceSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getPrice(@Query('service') service: ServiceType) {
    const price = await this.getPriceUseCase.execute(service);
    
    return successResponse({price},'تم إرجاع سعر الخدمة بنجاح',200)
  }
}