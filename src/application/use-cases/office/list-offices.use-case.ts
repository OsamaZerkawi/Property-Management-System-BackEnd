import { Inject, Injectable } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { OfficeRepository } from 'src/infrastructure/repositories/office.repository';

export interface OfficeListItem {
  name: string;
  logo: string | null;
  type: string;
  location: string;
  rate: number;
}

@Injectable()
export class ListOfficesUseCase {
  constructor(
     @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}
 
  async execute(page:number,items:number,baseUrl: string): Promise<OfficeListItem[]> {
    const raws = await this.officeRepo.findAllWithAvgRating(page,items);

    const offices: OfficeListItem[] = raws.map(r => {
      const logoFileName = r.logo;
      const logo = logoFileName
        ? `${baseUrl}/uploads/offices/logos/${logoFileName}`
        : null; 
      return {
        officeId: r.id,
        name: r.name,
        logo: logo,
        type: r.office_type,
        location: `${r.city_name || ''}، ${
          r.region_name || ''
        }`.trim(),
        rate: typeof r.avg_rate === 'string' ? parseFloat(r.avg_rate) : (r.avg_rate ?? 0),
      };
    });

    return offices;
  }
}
