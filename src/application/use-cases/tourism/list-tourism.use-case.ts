import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITourismRepository } from '../../../domain/repositories/tourism.repository';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from '../../../domain/repositories/office.repository';
import {TOURISM_REPOSITORY} from '../../../domain/repositories/tourism.repository';

@Injectable()
export class ListTourismUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly repo: ITourismRepository,
  ) {}
  async execute(userId: number,baseUrl: string) {
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
    return this.repo.findAllByOffice(office.id,baseUrl);
  }
}
