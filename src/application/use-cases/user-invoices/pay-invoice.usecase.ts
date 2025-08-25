// src/application/use-cases/invoice/pay-invoice.usecase.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from 'src/domain/repositories/user-property-invoices.repository';
 
@Injectable()
export class PayInvoiceUseCase {
  constructor( 
        @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
        private readonly userInvoicesRepo: UserPropertyInvoiceRepositoryInterface,) {}

  async execute(invoiceId: number, paymentIntentId: string) {
    if (!paymentIntentId) {
      throw new BadRequestException('paymentIntentId مطلوب');
    }
    await this.userInvoicesRepo.markInvoiceAsPaid(invoiceId, paymentIntentId);
  }
}
