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
    
   async execute(
  page: number,
  items: number,
  baseUrl: string,
  cityId?: number,
  regionId?: number,
  type?: string,
  rate?: number,
): Promise<{ data: OfficeListItem[]; total: number }> {
  const raws = await this.officeRepo.findAllWithAvgRating(
    page,
    items,
    cityId,
    regionId,
    type,
    rate,
  );

  const offices: OfficeListItem[] = raws.data.map((r) => {
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
      rate:
        typeof r.avg_rate === 'string'
          ? parseFloat(parseFloat(r.avg_rate).toFixed(1))
          : r.avg_rate ?? 0.00,
    };
  });

  return { data: offices, total: raws.total };
}


}
