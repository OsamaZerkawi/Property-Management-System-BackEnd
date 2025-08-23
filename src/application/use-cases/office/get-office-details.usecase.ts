import {Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';

@Injectable()
export class GetOfficeDetailsUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number,baseUrl:string) {
    const office =  await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
      return {
    id: office.id,
    name: office.name,
    phone: office.user.phone,
    logo:   office.logo
      ? `${baseUrl}/uploads/offices/logos/${office.logo}`
      : null,
    type: office.type,
    commission: office.commission,
    booking_period: office.booking_period,
    deposit_per_m2: office.deposit_per_m2,
    tourism_deposit: office.tourism_deposit,
    payment_method: office.payment_method,
    opening_time: office.opening_time,
    closing_time: office.closing_time,
    latitude: office.latitude,
    longitude: office.longitude,
    region: office.region
      ? {
          id: office.region.id,
          name: office.region.name,
        }
      : null,

    city: office.region?.city
      ? {
          id: office.region.city.id,
          name: office.region.city.name,
        }
      : null,

    default_meter_price: office.region?.default_meter_price ?? null,
    socials: office.socials?.map(s => ({
      id: s.id,
      name: s.platform?.name,  
      link: s.link,
    })) ?? [],
  };
  }
}
