import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITourismRepository } from '../../../domain/repositories/tourism.repository';
import { UpdateTourismDto } from '../../dtos/tourism/update-tourism.dto';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from '../../../domain/repositories/office.repository';
import {TOURISM_REPOSITORY} from '../../../domain/repositories/tourism.repository';

@Injectable()
export class UpdateTourismUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly repo: ITourismRepository,
  ) {}

  async execute(userId: number, propertyId: number, dto: UpdateTourismDto) {
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');

    
    const existing = await this.repo.findPropertyById(propertyId);
    if (!existing || existing.office.id !== office.id) {
      throw new NotFoundException('العقار السياحي غير موجود للمكتب');
    }

    this.repo.updateTourism(propertyId, dto);
  }
}
