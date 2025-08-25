 
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RENTAL_CONTRACT_REPOSITORY, RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
  
@Injectable()
export class UploadInvoiceDocumentUseCase {
  constructor(
    @Inject(RENTAL_CONTRACT_REPOSITORY)
    private readonly invoiceRepo: RentalContractRepositoryInterface,
   ) {}

  async execute(invoiceId: number, filename: string): Promise<void> {
      const invoice = await  this.invoiceRepo.findOneById(invoiceId);
      if (!invoice) {
        throw new NotFoundException('الفاتورة غير موجودة');
      }
      if(invoice.invoiceImage!=null){
        throw new BadRequestException('يوجد وثيقة لهذا السجل بالفعل');
      } 
      await this.invoiceRepo.saveInvoice(invoiceId,filename); 
  }
}

