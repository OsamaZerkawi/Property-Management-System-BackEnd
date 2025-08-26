// src/infrastructure/repositories/rental-contract.repository.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { RentalContract } from 'src/domain/entities/rental-contract.entity';
import { RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractFiltersDto } from 'src/application/dtos/rental_contracts/filter-rental-contract.dto';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { Property } from 'src/domain/entities/property.entity';
import { addDays, addMonths, addYears, startOfDay } from 'date-fns';
import { PropertyStatus } from 'src/domain/enums/property-status.enum';
import { Residential } from 'src/domain/entities/residential.entity';
import { RentalPeriod } from 'src/domain/enums/rental-period.enum';
import { InoviceReasons } from 'src/domain/enums/inovice-reasons.enum';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
 
@Injectable()
export class RentalContractRepository  
  implements RentalContractRepositoryInterface 
{
  constructor(
    @InjectRepository(RentalContract)
    private readonly repo: Repository<RentalContract>,
    @InjectRepository(UserPropertyInvoice)
    private readonly InvoiceRepo: Repository<UserPropertyInvoice>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly dataSource: DataSource) {}
 
  async save(contract: RentalContract): Promise<RentalContract> {
    return this.repo.save(contract);
  } 
async findContractsByOfficeId(
  officeId: number,
  filters: ContractFiltersDto = {},
): Promise<Array<{
  id:  number,
  image: string;
  region:string,
  city:string,
  title: string;
  start_date: string;
  end_date: string;
  phone: string;
  status: string;
}>> {
  const qb = this.repo.createQueryBuilder('rc')
    .innerJoin('rc.residential', 'r')
    .innerJoin('r.property', 'p', 'p.office_id = :officeId', { officeId })
    .innerJoin('p.post', 'pp', 'pp.status = :postStatus', { postStatus: 'مقبول' })
    .innerJoin('rc.user', 'u')
    .innerJoin('p.region', 'region')
    .innerJoin('region.city', 'city')
    .select([
      'rc.id AS id',
      'pp.image AS image',
      'pp.title AS title',
      'rc.start_date AS start_date',
      'rc.end_date AS end_date',
      'u.phone AS phone',
      'r.status AS status',
      'region.name AS region',   
      'city.name AS city',
    ])
    .orderBy('rc.start_date', 'DESC');

  if (filters.status) {
    qb.andWhere('rc.status = :status', { status: filters.status });
  }

  if (filters.cityId) {
    qb.andWhere('city.id = :cityId', { cityId: filters.cityId });
  }

  if (filters.regionId) {
    qb.andWhere('region.id = :regionId', { regionId: filters.regionId });
  }

  return qb.getRawMany();
} 
async searchContractsBytitle(
  officeId: number,
  keyword: string,
): Promise<Array<{
  image: string;
  title: string;
  start_date: string;
  end_date: string;
  phone: string;
  status: string;
  region: string;
  city: string;
}>> {
  return this.repo.createQueryBuilder('rc')
    .innerJoin('rc.residential', 'r')
    .innerJoin('r.property', 'p', 'p.office_id = :officeId', { officeId })
    .innerJoin('p.post', 'pp', 'pp.status = :postStatus', { postStatus: 'مقبول' })
    .innerJoin('rc.user', 'u') 
    .innerJoin('p.region', 'region')
    .innerJoin('region.city', 'city')
    .select([
      'pp.image      AS image',
      'pp.title      AS title',
      'rc.start_date AS start_date',
      'rc.end_date   AS end_date',
      'u.phone       AS phone',
      'r.status      AS status',
      'region.name   AS region',
      'city.name     AS city',
    ])
    .where('LOWER(pp.title) LIKE LOWER(:kw)', { kw: `%${keyword}%` })
    .orderBy('rc.start_date', 'DESC')
    .getRawMany();
}

async findByIdWithRelations(id: number): Promise<RentalContract | null> {
  return this.repo.findOne({
    where: { id },
    relations: {
      user: true,
      residential: {
        property: {
          post: true, 
          region: {
            city: true,
          },
        },
      },
    },
  });
}

  async verifyPropertyBelongsToOffice(
    propertyId: number,
    officeId: number,
  ): Promise<boolean> {
    const count = await this.propertyRepo.count({
      where: { id: propertyId, office: { id: officeId } },
    });
    return count > 0;
  }

  async findInvoicesByPropertyAndUser(
    propertyId: number,
    userId: number,
  ): Promise<UserPropertyInvoice[]> {
    return this.InvoiceRepo.find({
      where: {
        property: { id: propertyId },
        user:     { id: userId },
      },
      order: { billing_period_start: 'ASC' },
    });
  }
  async createRentalBooking( 
    userId: number,
    propertyId: number,
    periodCount: number,
    totalPrice: number,
    paymentIntentId?: string
  )  { 

    return await this.dataSource.transaction(async (manager) => {
 
      const property = await manager.findOne( Property , {
        where: { id: propertyId },
        relations: ['residential', 'office'],
      } as any);

      if (!property) throw new NotFoundException('العقار غير موجود');
      if (!property.residential) throw new NotFoundException('تفاصيل السكني غير موجودة');

      const residential = property.residential;
      const office = property.office;

     const isAvailable = residential.status===PropertyStatus.AVAILABLE; 
        if (!isAvailable) throw new BadRequestException('العقار محجوز أو غير متوفر حالياً');
 
      const startDate = startOfDay(new Date());
      let endDate: Date;
    
      const rentalPeriod = residential.rental_period ?? RentalPeriod.MONTHLY; 
       let reason;
      if (rentalPeriod===RentalPeriod.YEARLY) {
        endDate = addYears(startDate, periodCount);
        reason=InoviceReasons.YEARLY_RENT
      } else { 
        endDate = addMonths(startDate, periodCount);
        reason=InoviceReasons.MONTHLY_RENT
      }
 
      const rcRepo = manager.getRepository(RentalContract);
      const rentalPayload: DeepPartial<any> = {
        user: { id: userId } as any,
        residential: { id: residential.id } as any,
        period: periodCount,
        start_date: startDate,
        end_date: endDate,
        price_per_period: totalPrice, 
      };
      const rentalContract = rcRepo.create(rentalPayload);
      await rcRepo.save(rentalContract);
 
      residential.status = PropertyStatus.RESERVED;
      await manager.save( Residential , residential);
 
      const invoiceRepo = manager.getRepository( UserPropertyInvoice );
      const perPeriodRaw = Number(totalPrice) / Number(periodCount); 
      const perPeriod = Math.round(perPeriodRaw * 100) / 100;
 
      let curStart = startDate; 
      for (let i = 0; i < periodCount; i++) {
        const isFirst = i === 0; 
        const billingStart = curStart; 
        const paymentDeadline = addMonths(billingStart, 1);
        const invoicePayload: DeepPartial<any> = {
          user: { id: userId } as any,
          property: { id: propertyId } as any,
          calendar: null,
          amount:  perPeriod,  
          billing_period_start: billingStart,
          payment_deadline: paymentDeadline,
          reason: reason,
          status: isFirst && paymentIntentId ?  InvoicesStatus.PAID  :  InvoicesStatus.PENDING ,
          stripePaymentIntentId: isFirst && paymentIntentId ? paymentIntentId : null,
          paymentMethod:  PaymentMethod.STRIPE , 
        }; 
         const invoice = invoiceRepo.create(invoicePayload);  
         await invoiceRepo.save(invoice);  
         curStart = rentalPeriod === RentalPeriod.YEARLY   ? addYears(billingStart, 1) : addMonths(billingStart, 1);
      } 
    });
  }
}