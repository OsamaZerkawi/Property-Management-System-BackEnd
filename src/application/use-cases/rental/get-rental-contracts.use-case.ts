import { Injectable, NotFoundException, Inject } from '@nestjs/common';
 import { RENTAL_CONTRACT_REPOSITORY, RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { RentalContractRepository } from 'src/infrastructure/repositories/rental-contract.repository';

@Injectable()
export class GetRentalContractsUseCase {
  constructor(
      @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
      @Inject(RENTAL_CONTRACT_REPOSITORY)
        private readonly rentalContractRepo: RentalContractRepository,  ) {}

  async execute(userId: number) {
   const office = await this.officeRepo.findOneByUserId(userId);
   if (!office) throw new NotFoundException('المكتب غير موجود');

    return this.rentalContractRepo.findContractsByOfficeId(office.id);
  }
}