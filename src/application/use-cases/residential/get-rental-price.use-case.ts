import { Inject, Injectable } from '@nestjs/common';
import { RESIDENTIAL_PROPERTY_REPOSITORY } from 'src/domain/repositories/residential-property.repository';
import { ResidentialPropertyRepositoryInterface } from 'src/domain/repositories/residential-property.repository';

@Injectable()
export class GetRentalPriceUseCase {
  constructor(
    @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
    private readonly residentialRepository: ResidentialPropertyRepositoryInterface,
  ) {}

  async execute(propertyId: number): Promise<number> {
    const residential = await this.residentialRepository.findOneByPropertyId(propertyId);
    
    if (!residential) {
      throw new Error('عقار سكني غير موجود');
    }

    return residential.rental_price;
  }
}