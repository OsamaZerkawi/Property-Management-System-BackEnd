import { Inject, Injectable,NotFoundException } from '@nestjs/common';
import { RESIDENTIAL_PROPERTY_REPOSITORY } from 'src/domain/repositories/residential-property.repository';
import { ResidentialPropertyRepositoryInterface } from 'src/domain/repositories/residential-property.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';

@Injectable()
export class GetRentalPriceUseCase {
  constructor(
    @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
    private readonly residentialRepository: ResidentialPropertyRepositoryInterface,
  ) {}

  async execute(propertyId: number): Promise<{ rental_price: number | null, message?: string }> {
    const residential = await this.residentialRepository.findOneByPropertyId(propertyId);
    
    if (!residential) {
        throw new NotFoundException(
                      errorResponse('عقار سكني غير موجود',404)
                  ); 
    }

    return {
      rental_price: residential.rental_price
    };
  }
}