// src/application/use-cases/get-contract-details.use-case.ts

import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  RENTAL_CONTRACT_REPOSITORY,
  RentalContractRepositoryInterface,
} from 'src/domain/repositories/rental-contract.repository';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
 
@Injectable()
export class GetContractDetailsUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,

    @Inject(RENTAL_CONTRACT_REPOSITORY)
    private readonly rentalContractRepo: RentalContractRepositoryInterface,
  ) {}

  async execute(userId: number, contractId: number,baseUrl: string) { 
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
 
    const contract = await this.rentalContractRepo.findByIdWithRelations(contractId);
    if (!contract) throw new NotFoundException('العقد غير موجود');
 
    const propertyId = contract.residential.property.id;
    const owned = await this.rentalContractRepo.verifyPropertyBelongsToOffice(
      propertyId,
      office.id,
    );
    if (!owned) throw new ForbiddenException('العقار لا يتبع لهذا المكتب');
 
    const invoices = await this.rentalContractRepo.findInvoicesByPropertyAndUser(
      propertyId,
      contract.user.id,
    );
 
    const formattedContract = {
      id: contract.id,
      start_date: contract.start_date,
      end_date: contract.end_date,
      status: contract.status,
      post_image: `${baseUrl}/uploads/properties/posts/images/${contract.residential.property.post.image}` || null,
    };

    const formattedInvoices = invoices.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      billing_period_start: inv.billing_period_start,
      status: inv.status,
      reason: inv.reason,
      payment_method: inv.status === InvoicesStatus.PENDING ? null : inv.paymentMethod,
      documentImage: inv.invoiceImage? `${baseUrl}/uploads/UserRentalInvoices/${inv.invoiceImage}`: null,

    })); 

    return { contract: formattedContract, invoices: formattedInvoices };
  }
}
