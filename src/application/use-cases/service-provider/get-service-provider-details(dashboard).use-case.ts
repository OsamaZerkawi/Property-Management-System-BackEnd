import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from 'src/domain/repositories/service-provider.repository';
 
@Injectable()
export class GetServiceProviderUseCase {
  constructor(
   @Inject(SERVICE_PROVIDER_REPOSITORY)
   private readonly serviceProviderRepo: ServiceProviderRepositoryInterface,
  ) {}

  async execute(userId: number, baseUrl: string) {
    const sp = await this.serviceProviderRepo.findOneByUserId(userId);
    if (!sp) throw new NotFoundException('مزود الخدمة غير موجود');
    
    return {
      id: sp.id,
      name: sp.name,
      phone: sp.user?.phone ?? null,
      logo: sp.logo ? `${baseUrl}/uploads/providers/logo/${sp.logo}` : null,
      details: sp.details ?? null,
      career: sp.career ?? null,
      status:sp.active,
      opening_time: sp.opening_time ?? null,
      closing_time: sp.closing_time ?? null, 
      region: sp.region ? { id: sp.region.id, name: sp.region.name } : null,
      city: sp.region?.city ? { id: sp.region.city.id, name: sp.region.city.name } : null,
    };
  }
}
