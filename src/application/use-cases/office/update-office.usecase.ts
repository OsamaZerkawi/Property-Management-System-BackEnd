import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UpdateOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

async execute(userId: number, dto: UpdateOfficeDto) {
  const office = await this.officeRepo.findOneByUserId(userId);
  if (!office) throw new NotFoundException('المكتب غير موجود');
 
  if (dto.logo && office.logo && dto.logo !== office.logo) {
    try {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads/offices/logos',
        office.logo,
      );
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    } catch (err) {
      console.warn('Error deleting old logo:', err);
    }
  }
 
  await this.officeRepo.updateOfficeWithSocials(office, dto);
}
}