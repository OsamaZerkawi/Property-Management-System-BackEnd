import {Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';

@Injectable()
export class GetOfficeDetailsUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly repo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, officeId: number) {
    const office = await this.repo.findById(officeId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
    if (office.user.id !== userId) throw new ForbiddenException('لا تملك صلاحية مشاهدة هذا المكتب');
    return office;
  }
}
