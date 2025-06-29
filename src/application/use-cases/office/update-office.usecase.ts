import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';

@Injectable()
export class UpdateOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number,  dto: UpdateOfficeDto) { 
    const office =  await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
 
    return this.officeRepo.updateOfficeWithSocials(office.id, dto);
  }
}