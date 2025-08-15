import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
 
@Injectable()
export class GetOfficeDetailsMobileUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(officeId: number, baseUrl: string) {
    const details = await this.officeRepo.findOfficeDetailsById(officeId, baseUrl);
    if (!details) {
      throw new NotFoundException('المكتب غير موجود');
    }
    return details;
  }
}
