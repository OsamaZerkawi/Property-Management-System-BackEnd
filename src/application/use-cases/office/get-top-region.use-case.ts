import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common'; 
import { OfficeType } from 'src/domain/enums/office-type.enum';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from 'src/domain/repositories/residential-property.repository';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';

@Injectable()
export class GetTopRegionsUseCase {
  constructor(
    @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
    private readonly residentailRepo: ResidentialPropertyRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly tourismRepo: ITourismRepository,  
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}
 
  async execute(
    userId: number, 
  ): Promise<{ tourism?: string[]; residential?: string[] }> {
 
    const office = await this.officeRepo.findOfficeByUserId(userId);
    if (!office) {
      throw new NotFoundException('المكتب غير موجود');
    }
    const officeId=office.id
    const result: { tourism?: string[]; residential?: string[] } = {};
 
    switch (office.type as OfficeType) {
      case OfficeType.TOURISTIC:
        result.tourism = await this.tourismRepo.findTopTouristicLocationsByOffice(officeId);
        break;

      case OfficeType.RESIDENTIAL:
        result.residential = await this.residentailRepo.findTopResidentialLocationsByOffice(officeId);
        break;

      case OfficeType.BOTH:
      default: 
        const [tourism, residential] = await Promise.all([
          this.tourismRepo.findTopTouristicLocationsByOffice(officeId),
          this.residentailRepo.findTopResidentialLocationsByOffice(officeId),
        ]);
        result.tourism = tourism;
        result.residential = residential;
        break;
    }

    return result;
  }
}
