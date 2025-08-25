// src/application/use-cases/service-provider/update-service-provider.use-case.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
 
import { Inject } from '@nestjs/common';
import { UpdateServiceProviderDto } from 'src/application/dtos/service-provider/update-service-provider.dto';
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from 'src/domain/repositories/service-provider.repository';
 
@Injectable()
export class UpdateServiceProviderUseCase {
  constructor(
      @Inject(SERVICE_PROVIDER_REPOSITORY)
          private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
  ) {}

 async execute(userId: number, dto: UpdateServiceProviderDto): Promise<void> {
    const sp = await this.serviceProviderRepo.findOneByUserId(userId);
    if (!sp) throw new NotFoundException('مزود الخدمة غير موجود للمستخدم');
 
    await this.serviceProviderRepo.updateServiceProvider(sp.id, { dto, userId });
 
  }
}
