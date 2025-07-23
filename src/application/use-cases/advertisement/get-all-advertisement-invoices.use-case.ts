import { Inject, Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { InvoiceType } from "src/domain/enums/invoice.type.enum";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";

@Injectable()
export class GetAllAdvertisementInvoicesUseCase {
  constructor(
    @Inject(ADVERTISEMENT_REPOSITORY)
    private readonly advertisementRepo: AdvertisementRepositoryInterface,
  ) {}


  async execute(baseUrl: string){
    const invoices = await this.advertisementRepo.findAllWithInvoices();

    return invoices.map(invoice => {
      const paidDate = invoice.paid_date ? new Date(invoice.paid_date) : null;
    
      //should to add promoted advertisements in future
      return {
        id: invoice.id,
        amount: invoice.amount,
        type: invoice.type,
        paid_date: paidDate ? paidDate.toISOString().split('T')[0] : null,
        office_id: invoice.office.id,
        office_name: invoice.office.name,
        ...(invoice.type === InvoiceType.IMAGE && {
            image: baseUrl + '/uploads/advertisements/images' + invoice.advertisement.image,
        }),
      };
    });  
  }
}