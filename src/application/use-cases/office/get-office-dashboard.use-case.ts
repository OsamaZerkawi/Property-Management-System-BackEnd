import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';

@Injectable()
export class GetOfficeDashboardUseCase {
  constructor(
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
  ) {}
 
  async execute(userId: number, baseUrl: string) { 

  const office =  await this.officeRepo.findOneByUserId(userId);

    if (!office) throw new NotFoundException('المكتب غير موجود');

    const row = await this.officeRepo.getOfficeDashboardByOfficeId(office.id);
      
   const logo = row.logo ? `${baseUrl}/uploads/offices/logos/${row.logo}` : null;
 
  const regionName = row.region_name ?? '';
  const cityName = row.city_name ?? '';
  const location = [cityName, regionName].filter(Boolean).join('، ');  


    return {
      name: row.name,
      logo,
      location,
      rate: row.avg_rate !== null && row.avg_rate !== undefined ? Number(row.avg_rate) : 0,
      profits: row.profits !== null && row.profits !== undefined ? Number(row.profits) : 0,
      touristicCount: Number(row.touristic_count ?? 0),
      totalProperties: Number(row.total_properties ?? 0),
      residentialSaleCount: Number(row.residential_sale_count ?? 0),
      residentialRentCount: Number(row.residential_rent_count ?? 0),
    };
  }
}
