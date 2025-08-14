import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Advertisement } from 'src/domain/entities/advertisements.entity';
import { Office } from 'src/domain/entities/offices.entity';
import { OnlineInvoice } from 'src/domain/entities/online-invoices.entity';
import { AdminAgreement } from 'src/domain/enums/admin-agreement.enum';
import { InvoiceType } from 'src/domain/enums/invoice.type.enum';
import { ServicePriceRepository } from 'src/infrastructure/repositories/service-price.repository';
import { ServiceType } from 'src/domain/enums/service-type.enum';
import { ServicePrice } from 'src/domain/entities/service-price.entity';

@Injectable()
export class AdvertisementSeeder {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly servicePriceRepo: Repository<ServicePrice>,
    @InjectRepository(Advertisement)
    private readonly advertisementRepo: Repository<Advertisement>,
    @InjectRepository(OnlineInvoice)
    private readonly invoiceRepo: Repository<OnlineInvoice>,
    @InjectRepository(Office)
    private readonly officeRepo: Repository<Office>,
  ) {}

  async seed() {
    const offices = await this.officeRepo.find();
    
    const service = await this.servicePriceRepo.findOne({
        where: {service : ServiceType.IMAGE_AD}
    });

    const price = service?.pricePerDay ?? 0;

    if (!offices.length) {
      console.warn('⚠️ No offices found. Cannot seed advertisements.');
      return;
    }

    // Pick up to 10 offices randomly
    const selectedOffices = faker.helpers.arrayElements(
      offices,
      Math.min(10, offices.length),
    );

    for (const office of selectedOffices) {
      // Create advertisement linked to invoice
      const ad = this.advertisementRepo.create({
        day_period: faker.number.int({ min: 3, max: 12 }),
        start_date: faker.date.recent({ days: 15 }),
        image: 'ads.jpeg',
        admin_agreement: AdminAgreement.APPROVED,
        is_paid: true,
        is_active: true,
        office,
      });
      // Create invoice
      const invoice = this.invoiceRepo.create({
        amount: ad.day_period * price,
        stripe_payment_intent_id: faker.number.int({
          min: 100000,
          max: 999999,
        }),
        type: InvoiceType.IMAGE,
        paid_date: faker.date.recent({ days: 15 }),
        office,
        image: 'invoice.jpeg',
      });

      const savedInvoice = await this.invoiceRepo.save(invoice);

      ad.invoice = savedInvoice;
      await this.advertisementRepo.save(ad);
    }

    console.log('✅ Seeded advertisements with invoices.');
  }
}
