import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { UploadPropertyReservationDto } from 'src/application/dtos/user-property-reservation/UploadProeprtyReservation.dto';
import { ReminderService } from 'src/application/services/reminder.service';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { UserPropertyPurchase } from 'src/domain/entities/user-property-purchase.entity';
import { InoviceReasons } from 'src/domain/enums/inovice-reasons.enum';
import { InstallmentPlanStatus } from 'src/domain/enums/installment-plan-status.enum';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { PurchaseStatus } from 'src/domain/enums/property-purchases.enum';
import { PropertyStatus } from 'src/domain/enums/property-status.enum';
import {
  PROPERTY_REPOSITORY,
  PropertyRepositoryInterface,
} from 'src/domain/repositories/property.repository';
import {
  REGION_REPOSITORY,
  RegionRepositoryInterface,
} from 'src/domain/repositories/region.repository';
import {
  RESIDENTIAL_PROPERTY_REPOSITORY,
  ResidentialPropertyRepositoryInterface,
} from 'src/domain/repositories/residential-property.repository';
import { UserPropertyInvoiceRepositoryInterface } from 'src/domain/repositories/user-property-invoices.repository';
import {
  USER_PURCHASE_REPOSITORY,
  UserPurchaseRepositoryInterface,
} from 'src/domain/repositories/user-purchase.repository';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { Brackets, DataSource, Repository } from 'typeorm';

export class UserPropertyInvoiceRepository
  implements UserPropertyInvoiceRepositoryInterface
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
    private readonly residentialPropertyRepo: ResidentialPropertyRepositoryInterface,
    @InjectRepository(UserPropertyInvoice)
    private readonly userPropertyInvoiceRepo: Repository<UserPropertyInvoice>,
    @Inject(USER_PURCHASE_REPOSITORY)
    private readonly userPurchaseRepo: UserPurchaseRepositoryInterface,
    private readonly reminderService: ReminderService,
    private readonly dataSource: DataSource,
  ) {}

  async getUserPropertyInvoices(userId: number, propertyId: number) {
    const allInvoices = await this.userPropertyInvoiceRepo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.property', 'property')
      .leftJoin(
        'residentials',
        'residential',
        'residential.property_id = property.id',
      )
      .leftJoin(
        'rental_contracts',
        'rc',
        `
            rc.user_id = invoice.user_id
            AND rc.residential_id = residential.id
            AND invoice.billing_period_start BETWEEN rc.start_date AND rc.end_date
          `,
      )
      .where('invoice.user_id = :userId', { userId })
      .andWhere('invoice.property_id = :propertyId', { propertyId })
      .getMany();

    const previous = allInvoices.filter(
      (inv) => inv.status !== InvoicesStatus.PENDING,
    );
    const current = allInvoices.filter(
      (inv) => inv.status === InvoicesStatus.PENDING,
    );
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
      .where('invoice.property_id = :propertyId', { propertyId })
      .orderBy('invoice.billing_period_start', 'ASC')
      .addOrderBy('invoice.created_at', 'ASC')
      .getMany();
  }

  async attachInvoiceImage(id: number, documentImage: string) {
    // === 1. Fetch invoice ===
    const invoice = await this.userPropertyInvoiceRepo.findOne({
      where: { id },
      relations: ['property', 'user'],
    });

    if (!invoice) {
      throw new NotFoundException(errorResponse('الفاتورة غير موجودة', 404));
    }

    // === 2. Update invoice ===
    invoice.invoiceImage = documentImage;
    invoice.paymentMethod = PaymentMethod.CASH;
    invoice.status = InvoicesStatus.PAID;
    await this.userPropertyInvoiceRepo.save(invoice);

    // === 3. Get related purchase ===
    const purchase = await this.userPurchaseRepo.findOneByUserIdAndPropertyId(
      invoice.user.id,
      invoice.property.id,
    );

    if (!purchase) return;

    // === 4. Handle business logic based on invoice type ===
    switch (invoice.reason) {
      case InoviceReasons.INSTALLMENT_PAYMENT:
        await this.handleInstallmentPayment(purchase);
        break;

      case InoviceReasons.PROPERTY_PURCHASE:
        await this.markPropertyAsSold(purchase);
        break;

      default:
        break;
    }
  }

  private async handleInstallmentPayment(purchase: UserPropertyPurchase) {
    purchase.installments_paid += 1;
    await this.userPurchaseRepo.save(purchase);

    const duration = purchase.residential.installment_duration;

    if (purchase.installments_paid >= duration) {
      await this.markPropertyAsSold(purchase);
    }
  }

  private async markPropertyAsSold(purchase: UserPropertyPurchase) {
    purchase.status = PurchaseStatus.SOLD;
    purchase.residential.status = PropertyStatus.SOLD;

    await Promise.all([
      this.userPurchaseRepo.save(purchase),
      this.residentialPropertyRepo.save(purchase.residential),
    ]);
  }

  async createInvoice(data: UploadPropertyReservationDto, image: string) {
    const property = await this.propertyRepo.findById(data.propertyId);
    if (!property) {
      throw new NotFoundException(
        errorResponse('لا يوجد عقار لهذا المعرف', 404),
      );
    }

    const user = await this.userRepo.findByPhone(data.phone);
    if (!user) {
      throw new NotFoundException(
        errorResponse('لا يوجد مستخدم لهذا الرقم', 404),
      );
    }

    const residential =
      await this.residentialPropertyRepo.updateStatusOfProperty(
        property.id,
        PropertyStatus.RESERVED,
      );

    // Book property to user
    const purchase = await this.userPurchaseRepo.bookPropertyForUser(
      residential,
      user,
    );

    // === Calculate amounts ===
    const depositAmount = property.area * property.office.deposit_per_m2;

    // Calculate property price and commission of office
    const fullPrice =
      residential.selling_price +
      residential.selling_price * property.office.commission;

    const remainingAmount = fullPrice - depositAmount;

    // === Create Deposit Invoice ===
    const depositInvoice = this.userPropertyInvoiceRepo.create({
      user,
      property,
      invoiceImage: image,
      amount: depositAmount,
      paymentMethod: PaymentMethod.CASH,
      status: InvoicesStatus.PAID,
      reason: InoviceReasons.DEPOSIT,
      billing_period_start: startOfMonth(new Date()),
    });

    await this.userPropertyInvoiceRepo.save(depositInvoice);

    if (data.installment == false || residential.installment_allowed == false) {
      // === Create Purchase (remaining) Invoice ===
      const purchaseInvoice = this.userPropertyInvoiceRepo.create({
        user,
        property,
        invoiceImage: image,
        status: InvoicesStatus.PENDING,
        reason: InoviceReasons.PROPERTY_PURCHASE,
        amount: remainingAmount,
        payment_deadline: purchase.end_booking,
      });

      await this.userPropertyInvoiceRepo.save(purchaseInvoice);

      await this.reminderService.scheduleRemindersForInvoice(purchaseInvoice);
      return;
    }

    // === INstallment Invoices ===

    const duration = residential.installment_duration;
    const monthlyAmount = Math.floor((remainingAmount / duration) * 100) / 100;
    let accumulated = 0;

    const endBooking: Date = purchase.end_booking;

    let firstInstallmentPeriod = startOfMonth(endBooking);

    for (let i = 1; i <= duration; i++) {
      let amount = monthlyAmount;
      if (i === duration) {
        amount = parseFloat((remainingAmount - accumulated).toFixed(2));
      }
      accumulated += amount;

      const invoicePeriod = addMonths(firstInstallmentPeriod, i - 1);

      const payment_deadline = i === 1 ? endBooking : endOfMonth(invoicePeriod);

      const installmentInvoice = this.userPropertyInvoiceRepo.create({
        user,
        property,
        amount,
        status: InvoicesStatus.PENDING,
        reason: InoviceReasons.INSTALLMENT_PAYMENT,
        billing_period_start: invoicePeriod,
        payment_deadline,
      });

      await this.userPropertyInvoiceRepo.save(installmentInvoice);

      await this.reminderService.scheduleRemindersForInvoice(
        installmentInvoice,
      );
    }
  }

  async saveBulk(
    invoices: UserPropertyInvoice[],
  ): Promise<UserPropertyInvoice[]> {
    return this.userPropertyInvoiceRepo.save(invoices);
  }
  async markInvoiceAsPaid(
    invoiceId: number,
    paymentIntentId: string,
  ): Promise<void> {
    const invoice = await this.userPropertyInvoiceRepo.findOneBy({
      id: invoiceId,
    });
    if (!invoice) throw new NotFoundException('الفاتورة غير موجودة');
    if (invoice.status === InvoicesStatus.PAID)
      throw new BadRequestException('الفاتورة مدفوعة مسبقاً');

    await this.userPropertyInvoiceRepo.update(
      { id: invoiceId },
      {
        stripePaymentIntentId: paymentIntentId,
        paymentMethod: PaymentMethod.STRIPE,
        status: InvoicesStatus.PAID,
      },
    );
  }
}
