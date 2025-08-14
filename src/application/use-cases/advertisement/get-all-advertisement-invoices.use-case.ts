import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { InvoiceType } from 'src/domain/enums/invoice.type.enum';
import {
  ADVERTISEMENT_REPOSITORY,
  AdvertisementRepositoryInterface,
} from 'src/domain/repositories/advertisement.repository';

@Injectable()
export class GetAllAdvertisementInvoicesUseCase {
  constructor(
    @Inject(ADVERTISEMENT_REPOSITORY)
    private readonly advertisementRepo: AdvertisementRepositoryInterface,
  ) {}

  async execute(baseUrl: string) {
    const invoices = await this.advertisementRepo.findAllWithInvoices();

    return invoices.map((invoice) => {
      const paidDate = invoice.paid_date
        ? new Date(invoice.paid_date).toISOString().split('T')[0]
        : null;

      const result: any = {
        id: invoice.id,
        amount: invoice.amount,
        type: invoice.type,
        paid_date: paidDate,
        office_id: invoice.office.id,
        office_name: invoice.office.name,
        image: `${baseUrl}/uploads/invoices/images/${invoice.image}`,
      };

      // if (invoice.advertisement) {
      //   result.image = `${baseUrl}/uploads/advertisements/images/${invoice.advertisement.image}`;
      // }

      // if (invoice.promotedProperty) {
      //   result.title = invoice.promotedProperty.property.post.title;
      // }

      return result;
    });
  }
}
