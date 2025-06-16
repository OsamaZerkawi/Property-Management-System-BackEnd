import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';

@Injectable()
export class UpdateOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly repo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, officeId: number, dto: UpdateOfficeDto) { 
    const existing = await this.repo.findById(officeId);
    if (!existing) throw new NotFoundException('المكتب غير موجود');
    if (existing.user.id !== userId) throw new ForbiddenException('لا تملك صلاحية تعديل هذا المكتب');

    return this.repo.updateOfficeWithSocials(officeId, dto);
  }
}