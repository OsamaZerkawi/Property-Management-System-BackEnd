
import { Inject, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PromotedProperty } from 'src/domain/entities/promoted-property.entity';
import { Property } from 'src/domain/entities/property.entity';
import { OnlineInvoice } from 'src/domain/entities/online-invoices.entity';
import { Office } from 'src/domain/entities/offices.entity';
import { InvoiceType } from 'src/domain/enums/invoice.type.enum';
import { CombinedPropertyStatus } from 'src/domain/enums/combined-property-status.enum';
import { PropertyStatus } from 'src/domain/enums/property-status.enum';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { Residential } from 'src/domain/entities/residential.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';

@Injectable()
export class PromotedPropertySeeder {
  constructor(
    @InjectRepository(PromotedProperty) private promotedRepo: Repository<PromotedProperty>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(OnlineInvoice) private invoiceRepo: Repository<OnlineInvoice>,
    @InjectRepository(Office) private officeRepo: Repository<Office>,
    @InjectRepository(Residential) private residentialRepo: Repository<Residential>,
    @InjectRepository(PropertyPost) private postRepo: Repository<PropertyPost>,
  ) {}

  async seed() {
    const properties = await this.propertyRepo.find({
      relations: ['residential','post'], // include residential relation if needed
    });
  
    const offices = await this.officeRepo.find();
  
    const selectedProperties = faker.helpers.arrayElements(properties, Math.min(10, properties.length));
  
    for (const property of selectedProperties) {
      const office = faker.helpers.arrayElement(offices);
  
      // ✅ Set post status to APPROVED
      property.post.status = PropertyPostStatus.APPROVED;
      await this.postRepo.save(property.post);
  
      // ✅ If residential exists, set status to AVAILABLE
      if (property.residential) {
        property.residential.status = PropertyStatus.AVAILABLE;
        await this.residentialRepo.save(property.residential);
      }
  
      await this.propertyRepo.save(property); 
  
      const invoice = this.invoiceRepo.create({
        amount: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
        stripe_payment_intent_id: faker.number.int({ min: 100000, max: 999999 }),
        type: InvoiceType.PROMOTIONAL,
        paid_date: faker.date.recent({ days: 10 }),
        office,
      });
  
      const savedInvoice = await this.invoiceRepo.save(invoice);
  
      const period = faker.number.int({ min: 3, max: 15 });
      const startDate = faker.date.recent({ days: 10 });
  
      const promoted = this.promotedRepo.create({
        property,
        period,
        start_date: startDate,
        onlineInvoice: savedInvoice,
      });
  
      await this.promotedRepo.save(promoted);
    }
  
    console.log('✅ Seeded promoted properties.');
  }
}
