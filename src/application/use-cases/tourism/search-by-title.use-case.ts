// search-by-title.use-case.ts
import { Injectable, Inject ,NotFoundException} from '@nestjs/common';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository'; 

@Injectable()
export class SearchByTitleUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly repo: ITourismRepository,
  ) {}

  async execute(userId: number,title: string ) {
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
    
    return this.repo.searchByTitleAndOffice(office.id,title );
  }
}