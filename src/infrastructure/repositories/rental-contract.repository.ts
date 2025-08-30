// src/infrastructure/repositories/rental-contract.repository.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager, Repository } from 'typeorm';
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
import { InvoicePdfService } from 'src/application/services/invoice-pdf.service';
 
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
    private readonly invoicePdfService:InvoicePdfService,
  
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
      let firstInvoice ;
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
          if (i === 0 && paymentIntentId) {
         firstInvoice = invoice;  
         console.log(firstInvoice)
      } 
         curStart = rentalPeriod === RentalPeriod.YEARLY   ? addYears(billingStart, 1) : addMonths(billingStart, 1);
      } 
      if (paymentIntentId && firstInvoice) {
      await this.generateAndUpdateInvoicePdf(manager, firstInvoice.id, paymentIntentId);
    }
    });
  }
  private parseToDate(value: any): Date | undefined|null {
  if (!value) return null;
  if (value instanceof Date) return value;
   const v = String(value);
   const isoDateMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [_, y, m, d] = isoDateMatch;
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  }
}

  private toYMD(value: any): string {
  const d = this.parseToDate(value);
  return d ? d.toISOString().slice(0, 10) : '';
}
  private async generateAndUpdateInvoicePdf(
  manager: EntityManager,
  invoiceId: number,
  paymentIntentId: string
) { 
  const invoice = await manager.findOne(UserPropertyInvoice, {
    where: { id: invoiceId },
    relations: ['user', 'property', 'property.post'],
  });

  if (!invoice) return;
 
  const payload = {
    invoiceId: invoice.id,
    createdAt: this.toYMD(invoice.created_at),
    amount: Number(invoice.amount || 0).toFixed(2),
    currency: 'SAR',
    reason: invoice.reason,
    status: invoice.status,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentIntentId: paymentIntentId,
    userName: invoice.user
      ? `${invoice.user.first_name || ''} ${invoice.user.last_name || ''}`.trim()
      : '',
    userPhone: invoice.user?.phone || '',
    postTitle: invoice.property?.post?.title || '',
    billingPeriodStart: this.toYMD(invoice.billing_period_start),
    paymentMethod: invoice.paymentMethod,
  };
 
  const { filename } = await this.invoicePdfService.generatePdf(payload);
 
  await manager.update(
    UserPropertyInvoice,
    invoice.id,
    { invoiceImage: filename }
  );
}

}