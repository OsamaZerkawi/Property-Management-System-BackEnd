// src/application/use-cases/rental/create-rental-contract.use-case.ts
import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRentalContractDto } from 'src/application/dtos/rental_contracts/create-rental-contract.dto';
import { RENTAL_CONTRACT_REPOSITORY, RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from 'src/domain/repositories/user-property-invoices.repository';
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from 'src/domain/repositories/property.repository';
import { RentalContract } from 'src/domain/entities/rental-contract.entity';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { InoviceReasons } from 'src/domain/enums/inovice-reasons.enum';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
import { addMonths, startOfMonth, format } from 'date-fns';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { DataSource } from 'typeorm';
import { Residential } from 'src/domain/entities/residential.entity';
import { PropertyStatus } from 'src/domain/enums/property-status.enum';

@Injectable()
export class CreateRentalContractUseCase {
  constructor(
    @Inject(RENTAL_CONTRACT_REPOSITORY)
    private readonly rentalContractRepo: RentalContractRepositoryInterface,
    @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
    private readonly invoiceRepo: UserPropertyInvoiceRepositoryInterface,
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    private readonly dataSource: DataSource
  ) {}

async execute(userId: number, dto: CreateRentalContractDto, documentImage: string) {
  const office = await this.officeRepo.findOneByUserId(userId);
  if (!office) throw new NotFoundException('المكتب غير موجود');

  const property = await this.propertyRepo.findOneByIdAndOffice(dto.propertyId, office.id);
  if (!property) {
    throw new BadRequestException('العقار غير موجود أو لا ينتمي لهذا المكتب');
  }
  const residential = await this.dataSource.getRepository(Residential).findOne({
      where: { id: dto.residentialId }
    });

  if (!residential) {
    throw new NotFoundException('العقار السكني غير موجود');
  }

  if (residential.status === PropertyStatus.Rented) {
    throw new BadRequestException('العقار مؤجر بالفعل');
  }

  const startDate = new Date();
  const endDate = addMonths(startDate, Number(dto.duration));

    await this.dataSource.transaction(async (manager) => {
    const rentalContract = new RentalContract();
    rentalContract.user = { id: dto.userId } as any;
    rentalContract.residential = { id: dto.residentialId } as any;
    rentalContract.period = dto.duration;
    rentalContract.start_date = format(startDate, 'yyyy-MM-dd');
    rentalContract.end_date = format(endDate, 'yyyy-MM-dd');
    rentalContract.price_per_period = dto.monthlyRent;

    await manager.getRepository(RentalContract).save(rentalContract);

    const invoices: UserPropertyInvoice[] = [];
    for (let i = 0; i < Number(dto.duration); i++) {
      const invoice = new UserPropertyInvoice();
      invoice.amount = dto.monthlyRent;
      invoice.reason = InoviceReasons.MONTHLY_RENT;

      if (i === 0) {
        invoice.status = InvoicesStatus.PAID;
        invoice.invoiceImage = documentImage;
      } else {
        invoice.status = InvoicesStatus.PENDING;
      }

      invoice.billing_period_start = startOfMonth(addMonths(startDate, i));
      invoice.paymentMethod = PaymentMethod.CASH;
      invoice.user = { id: dto.userId } as any;
      invoice.property = { id: dto.propertyId } as any;

      invoices.push(invoice);
    }

    await manager.getRepository(UserPropertyInvoice).save(invoices);
 
    await manager.getRepository(Residential).update(dto.residentialId, {
       status: PropertyStatus.Rented,
    });

  });
}
}