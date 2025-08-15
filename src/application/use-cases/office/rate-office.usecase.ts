// application/use-cases/rate-office.usecase.ts
import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { CreateOfficeRatingDto } from 'src/application/dtos/office/create-office-rating.dto';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
  
@Injectable()
export class RateOfficeUseCase {
  constructor( 
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, dto: CreateOfficeRatingDto): Promise<void> {
    const { office_id, rate } = dto;
 
    const office =  await this.officeRepo.findById(office_id);

    if (!office) throw new NotFoundException('المكتب غير موجود');

     await this.officeRepo.rateAnOffice(userId, office_id, rate);
 
    return;
  }
}
