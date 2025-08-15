 import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfficeComplaintDto } from 'src/application/dtos/office/create-office-complaint.dto';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
 import { OfficeRepository } from 'src/infrastructure/repositories/office.repository';

@Injectable()
export class ComplaintOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, dto: CreateOfficeComplaintDto): Promise<void> {
    const office = await this.officeRepo.findById(dto.office_id);
    if (!office) throw new NotFoundException('المكتب غير موجود');
 
    await this.officeRepo.createComplaint(userId, dto.office_id, dto.complaint);

    return;
  }
}
