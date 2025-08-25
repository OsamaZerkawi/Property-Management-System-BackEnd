 
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RENTAL_CONTRACT_REPOSITORY, RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from 'src/domain/repositories/user-property-invoices.repository';
  
@Injectable()
export class UploadInvoiceDocumentUseCase {
  constructor(
     @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
            private readonly userInvoicesRepo: UserPropertyInvoiceRepositoryInterface,
   ) {}

  async execute(invoiceId: number, filename: string): Promise<void> {
      const invoice = await  this.userInvoicesRepo.findOneById(invoiceId);
      if (!invoice) {
        throw new NotFoundException('الفاتورة غير موجودة');
      }
      if(invoice.invoiceImage!=null){
        throw new BadRequestException('يوجد وثيقة لهذا السجل بالفعل');
      } 
      await this.userInvoicesRepo.saveInvoice(invoiceId,filename); 
  }
}

