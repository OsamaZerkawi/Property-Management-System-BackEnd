import { Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import { UploadPropertyReservationDto } from "src/application/dtos/user-property-reservation/UploadProeprtyReservation.dto";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { InoviceReasons } from "src/domain/enums/inovice-reasons.enum";
import { InstallmentPlanStatus } from "src/domain/enums/installment-plan-status.enum";
import { InvoicesStatus } from "src/domain/enums/invoices-status.enum";
import { PaymentMethod } from "src/domain/enums/payment-method.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { REGION_REPOSITORY, RegionRepositoryInterface } from "src/domain/repositories/region.repository";
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { UserPropertyInvoiceRepositoryInterface } from "src/domain/repositories/user-property-invoices.repository";
import { USER_PURCHASE_REPOSITORY, UserPurchaseRepositoryInterface } from "src/domain/repositories/user-purchase.repository";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Brackets, Repository } from "typeorm";

export class UserPropertyInvoiceRepository implements UserPropertyInvoiceRepositoryInterface {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
        @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
        private readonly residentialPropertyRepo: ResidentialPropertyRepositoryInterface,
        @InjectRepository(UserPropertyInvoice)  
        private readonly userPropertyInvoiceRepo: Repository<UserPropertyInvoice>,
        @Inject(REGION_REPOSITORY)
        private readonly regionRepo: RegionRepositoryInterface,
        @Inject(USER_PURCHASE_REPOSITORY)
        private readonly userPurchaseRepo: UserPurchaseRepositoryInterface,
    ){}


    async getUserPropertyInvoices(userId: number,propertyId: number) {
       const today = new Date();
       const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
       const startOfYear = new Date(today.getFullYear(), 0, 1);
     
       const previous = await this.getInvoicesByPeriod(userId,propertyId, {
         monthlyBefore: startOfMonth,
         yearlyBefore: startOfYear,
         direction: 'before',
       });
     
       const current = await this.getInvoicesByPeriod(userId,propertyId, {
         monthlyAfter: startOfMonth,
         yearlyAfter: startOfYear,
         direction: 'after',
       });
     
       return {
         previous,
         current,
       };        
    }

    async findInvoicesByPropertyId(propertyId: number) {
        return await this.userPropertyInvoiceRepo
        .createQueryBuilder('invoice')
        .select([
        'invoice.id',
        'invoice.amount',
        'invoice.reason',
        'invoice.status',
        'invoice.paymentMethod',
        'invoice.payment_deadline',
        'invoice.invoiceImage',
        'invoice.billing_period_start',
        'invoice.created_at',
        ])
        .where('invoice.property_id = :propertyId',{propertyId})
        .orderBy('invoice.billing_period_start', 'ASC')
        .addOrderBy('invoice.created_at','ASC')
        .getMany();

    }

    async attachInvoiceImage(id: number, documentImage: string) {
        const invoice = await this.userPropertyInvoiceRepo.findOne({
            where: {id} 
        });

        if(!invoice){
            throw new NotFoundException(
                errorResponse('الفاتورة غير موجودة',404)
            );
        }

        invoice.invoiceImage = documentImage;
        invoice.paymentMethod = PaymentMethod.STRIPE;
        invoice.status = InvoicesStatus.PAID;
        
        await this.userPropertyInvoiceRepo.save(invoice);
    }

    async createInvoice(data: UploadPropertyReservationDto, image: string) {
      const property = await this.propertyRepo.findById(data.propertyId);
      if(!property){
          throw new NotFoundException(
              errorResponse('لا يوجد عقار لهذا المعرف',404)
          );
      }
      
      const user = await this.userRepo.findByPhone(data.phone);
      if(!user){
          throw new NotFoundException(
              errorResponse('لا يوجد مستخدم لهذا الرقم',404)
          );
      }

      const residential = await this.residentialPropertyRepo.updateStatusOfProperty(property.id,PropertyStatus.RESERVED);
      
      // Book property to user
      const purchase = await this.userPurchaseRepo.bookPropertyForUser(residential,user);

      // === Calculate amounts ===
      const depositAmount = property.area * property.office.deposit_per_m2;

      const fullPrice = residential.selling_price;

      const remainingAmount = fullPrice - depositAmount;

      // === Create Deposit Invoice ===
      const depositInvoice  = this.userPropertyInvoiceRepo.create({
          user,
          property,
          invoiceImage:image,
          amount:  depositAmount,
          paymentMethod:PaymentMethod.CASH,
          status:InvoicesStatus.PAID,
          reason:InoviceReasons.DEPOSIT,
          billing_period_start: startOfMonth(new Date()),
      });

      await this.userPropertyInvoiceRepo.save(depositInvoice);

      if(data.installment == false || residential.installment_allowed == false){
        // === Create Purchase (remaining) Invoice ===
        const purchaseInvoice = this.userPropertyInvoiceRepo.create({
          user,
          property,
          invoiceImage: image,
          status: InvoicesStatus.PENDING,
          reason:InoviceReasons.PROPERTY_PURCHASE,
          amount: remainingAmount,
          payment_deadline: purchase.end_booking
        });
  
        await this.userPropertyInvoiceRepo.save(purchaseInvoice);
        return;
      }

      // === INstallment Invoices ===

      const duration = residential.installment_duration;
      const monthlyAmount   = Math.floor((remainingAmount / duration) * 100) / 100;
      let accumulated = 0;

      const endBooking: Date = purchase.end_booking;

      let firstInstallmentPeriod = startOfMonth(endBooking);

      for(let i = 1; i <= duration; i++){
        let amount = monthlyAmount ;
        if(i === duration){
          amount = parseFloat((remainingAmount - accumulated).toFixed(2));
        }
        accumulated += amount;
        
        const invoicePeriod = addMonths(firstInstallmentPeriod, i - 1);

        const payment_deadline = i === 1 ? endBooking : endOfMonth(invoicePeriod) ;

        const installmentInvoice = this.userPropertyInvoiceRepo.create({
          user,
          property,
          amount,
          status: InvoicesStatus.PENDING,
          reason: InoviceReasons.INSTALLMENT_PAYMENT,
          billing_period_start: invoicePeriod,
          payment_deadline
        });

        await this.userPropertyInvoiceRepo.save(installmentInvoice);
      }
    }

    private async getInvoicesByPeriod(
      userId: number,
      propertyId: number,
      options: {
        monthlyBefore?: Date;
        yearlyBefore?: Date;
        monthlyAfter?: Date;
        yearlyAfter?: Date;
        direction: 'before' | 'after';
      }
    ) {
      const result = await this.userPropertyInvoiceRepo
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.property', 'property')
        .leftJoin('residentials', 'residential', 'residential.property_id = property.id')
        .leftJoin(
          'rental_contracts',
          'rc',
          `
            rc.user_id = invoice.user_id
            AND rc.residential_id = residential.id
            AND invoice.billing_period_start BETWEEN rc.start_date AND rc.end_date
          `
        )     
        .addSelect('rc.end_date', 'deadline_date')
        .where('invoice.user_id = :userId', { userId })
        .andWhere('invoice.property_id = :propertyId', { propertyId })
        .andWhere(
          new Brackets((qb) => {
            if (options.direction === 'before') {
              qb.where(
                `(invoice.reason = :monthly AND invoice.billing_period_start < :monthlyBefore)`,
                { monthly: InoviceReasons.MONTHLY_RENT, monthlyBefore: options.monthlyBefore }
              ).orWhere(
                `(invoice.reason = :yearly AND invoice.billing_period_start < :yearlyBefore)`,
                { yearly: InoviceReasons.YEARLY_RENT, yearlyBefore: options.yearlyBefore }
              );
            } else {
              qb.where(
                `(invoice.reason = :monthly AND invoice.billing_period_start >= :monthlyAfter)`,
                { monthly: InoviceReasons.MONTHLY_RENT, monthlyAfter: options.monthlyAfter }
              ).orWhere(
                `(invoice.reason = :yearly AND invoice.billing_period_start >= :yearlyAfter)`,
                { yearly: InoviceReasons.YEARLY_RENT, yearlyAfter: options.yearlyAfter }
              );
            }
          })
        )
        .orderBy('invoice.billing_period_start', options.direction === 'before' ? 'DESC' : 'ASC')
        .getRawAndEntities();
    
      return result.entities.map((entity, idx) => {
        return {
          ...entity,
          deadline_date: result.raw[idx]?.deadline_date ? new Date(result.raw[idx].deadline_date) : null,
        };
      });
    }
    async saveBulk(invoices: UserPropertyInvoice[]): Promise<UserPropertyInvoice[]> {
    return this.userPropertyInvoiceRepo.save(invoices);
  }
}