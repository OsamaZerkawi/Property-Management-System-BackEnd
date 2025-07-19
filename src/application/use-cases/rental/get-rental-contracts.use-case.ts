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

  async execute(userId: number, baseUrl: string){ 
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) {
      throw new NotFoundException('المكتب غير موجود');
    }
 
    const raws = await this.rentalContractRepo.findContractsByOfficeId(office.id);
    return raws.map(r => ({
      title:     r.title,
      startDate: r.start_date,
      endDate:   r.end_date,
      phone:     r.phone,
      price:     r.price,
      status:    r.status,
      postImage:  `${baseUrl}/uploads/properties/posts/images/${r.image}`,
    }));
  }
}