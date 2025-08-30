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
import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';
 
@Injectable()
export class GetContractDetailsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
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
    const user=await this.userRepo.findUserInfoById(contract.user.id); 
    const region = contract.residential.property.region.name;
    const city = contract.residential.property.region.city.name;
    const formattedContract = {
      id: contract.id,
      title:contract.residential.property.post.title,
      startDate: contract.start_date,
      endDate: contract.end_date,
      status: contract.status,
      phone: user.phone,
      location: `${city}، ${region}`,
      imageUrl: `${baseUrl}/uploads/properties/posts/images/${contract.residential.property.post.image}` || null,
    };

    const formattedInvoices = invoices.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      created_at: inv.billing_period_start,
      status: inv.status,
      reason: inv.reason,
      paymentMethod: inv.status === InvoicesStatus.PENDING ? null : inv.paymentMethod,
      invoiceImage: inv.invoiceImage? `${baseUrl}/uploads/properties/users/invoices/images/${inv.invoiceImage}`: null,
    })); 

    return {  formattedContract, invoices: formattedInvoices };
  }
}
