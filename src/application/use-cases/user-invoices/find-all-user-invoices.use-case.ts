import { Inject, Injectable } from "@nestjs/common";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from "src/domain/repositories/user-property-invoices.repository";

@Injectable()
export class FindAllUserInvoicesUseCase {
    constructor(
        @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
        private readonly userInvoicesRepo: UserPropertyInvoiceRepositoryInterface,
    ){}

    async execute(userId: number,residentialId: number,baseUrl: string){
      const { previous, current } = await this.userInvoicesRepo.getUserPropertyInvoices(userId,residentialId);

      return {
        previous: previous.map((invoice) => this.formatPreviousInvoice(invoice,baseUrl)),
        current: current.map((invoice) => this.formatCurrentInvoice(invoice)),
      };
    }

    private formatPreviousInvoice(invoice,baseUrl: string) {
      return {
        id: invoice.id,
        date: invoice.billing_period_start,
        reason: invoice.reason,
        payment_method: invoice.paymentMethod,
        amount: Number(invoice.amount),
        status: invoice.status,
        invoiceImage:`${baseUrl}/uploads/properties/users/invoices/images/${invoice.invoiceImage}` // maybe should to modify path of image
      };
    }
    
    private formatCurrentInvoice(invoice) {
      return {
        id: invoice.id,
        reason: invoice.reason,
        amount: Number(invoice.amount),
        status: invoice.status,
        deadline: invoice.payment_deadline,
      };
    }    
}