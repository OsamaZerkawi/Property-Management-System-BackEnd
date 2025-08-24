import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { FinanceRecord } from 'src/infrastructure/repositories/tourism.repository';
 
export interface MonthlyFinance {
  month: number;
  records: FinanceRecord[];
}

@Injectable()
export class GetTourismFinanceByYearUseCase {
  constructor( 
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
        @Inject(TOURISM_REPOSITORY)
        private readonly repo: ITourismRepository,
  ) {}

  async execute(propertyId: number, year: number,userId:number,baseUrl: string): Promise<MonthlyFinance[]> {

    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');

    const existing = await this.repo.findPropertyById(propertyId);
    if (!existing || existing.office.id !== office.id) {
      throw new NotFoundException('العقار السياحي غير موجود للمكتب');
    }
    const currentYear  = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (year > currentYear) {
      throw new BadRequestException('السنة غير صحيحة');
    }

    const lastMonth = (year === currentYear) ? currentMonth : 12;
    const result: MonthlyFinance[] = [];

    for (let m = 1; m <= lastMonth; m++) {
      const records = await this.repo.findByMonth(propertyId, year, m,baseUrl);
      result.push({ month: m, records });
    }

    result.some(mf => mf.records.length > 0);
    return result;
  }
}
