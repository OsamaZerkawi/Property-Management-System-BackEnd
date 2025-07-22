 
import { Injectable, NotFoundException, Inject } from '@nestjs/common'; 
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { RENTAL_CONTRACT_REPOSITORY, RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
 
@Injectable()
export class SearchRentalContractsUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,

    @Inject(RENTAL_CONTRACT_REPOSITORY)
    private readonly rentalContractRepo: RentalContractRepositoryInterface,
  ) {}

  /**
   * @param userId    
   * @param baseUrl  
   * @param keyword   
   */
  async execute(
    userId: number,
    baseUrl: string,
    keyword: string,
  ) { 
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) {
      throw new NotFoundException('المكتب غير موجود');
    }
 
    const raws = await this.rentalContractRepo.searchContractsBytitle(
      office.id,
      keyword,
    ); 
    return raws.map(r => ({
      title:     r.title,
      startDate: r.start_date,
      endDate:   r.end_date,
      phone:     r.phone,
      status:    r.status,
      imageUrl:  `${baseUrl}/uploads/UserRentalInvoices/${r.image}`,
    }));
  }
}
