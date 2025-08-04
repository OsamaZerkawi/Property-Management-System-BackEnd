import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePrice } from 'src/domain/entities/service-price.entity';
import { ServicePriceRepository } from 'src/infrastructure/repositories/service-price.repository';
import { GetServicePriceUseCase } from 'src/application/use-cases/get-service-price.use-case';
import { ServicePriceController } from 'src/presentation/http/controllers/service-price.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePrice])],
  controllers: [ServicePriceController],
  providers: [
    {
      provide: GetServicePriceUseCase,
      useFactory: (repo: ServicePriceRepository) => new GetServicePriceUseCase(repo),
      inject: [ServicePriceRepository],
    },
    ServicePriceRepository,
  ],
  exports: [ServicePriceRepository, GetServicePriceUseCase],
})
export class ServicePriceModule {}
