import { Inject, Injectable } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { OfficeRepository } from 'src/infrastructure/repositories/office.repository';

export interface OfficeListItem {
  officeId: number;
  name: string;
  logo: string | null;
  type: string;
  location: string;
  rate: number; 
}

@Injectable()
export class SearchOfficesUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
   ) {}
 
  async searchByName(
    name: string,
    page: number,
    items: number,
    baseUrl: string,
  ): Promise<{ data: OfficeListItem[]; total: number }> {
    const { data: raws, total } = await this.officeRepo.findByName(
      name,
      page,
      items,
    );

    const offices: OfficeListItem[] = raws.map((r) => {
      const logoFileName = r.logo;
      const logo = logoFileName
        ? `${baseUrl}/uploads/offices/logos/${logoFileName}`
        : null;

      return {
        officeId: r.id,
        name: r.name,
        logo,
        type: r.type,
        location: `${r.city_name || ''}، ${r.region_name || ''}`.trim(),
        rate: typeof r.avg_rate === 'string' ? parseFloat(r.avg_rate) : (r.avg_rate ?? 0.00),
       };
    });

    return { data: offices, total };
  }
}
