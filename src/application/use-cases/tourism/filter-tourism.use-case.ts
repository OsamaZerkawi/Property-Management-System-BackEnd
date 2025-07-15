// filter-tourism.use-case.ts
import { Injectable,NotFoundException,Inject} from '@nestjs/common';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository';
import { FilterTourismDto } from 'src/application/dtos/tourism/filter-tourism.dto';

@Injectable()
export class FilterTourismUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly repo: ITourismRepository,
  ) {}

  async execute(userId: number, filterDto: FilterTourismDto) {
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
    return this.repo.filterByOffice(office.id, filterDto);
  }
}