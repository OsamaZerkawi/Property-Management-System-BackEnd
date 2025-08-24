import { Inject, Injectable } from '@nestjs/common';
import { privateEncrypt } from 'crypto';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';
import {
  PROPERTY_REPOSITORY,
  PropertyRepositoryInterface,
} from 'src/domain/repositories/property.repository';
import {
  ITourismRepository,
  TOURISM_REPOSITORY,
} from 'src/domain/repositories/tourism.repository';

@Injectable()
export class GetTopRatedPropertiesForOfficeUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly touristicPropertyRepo: ITourismRepository,
  ) {}

  async execute(userId: number, type: PropertyType, baseUrl: string) {
    if (type === PropertyType.RESIDENTIAL) {
      return await this.propertyRepo.findFiveTopRatedPropertiesForOffice(
        userId,
        baseUrl,
      );
    } else if (PropertyType.TOURISTIC) {
      return await this.touristicPropertyRepo.findFiveTopRatedTourism(
        userId,
        baseUrl,
      );
    }
  }
}
