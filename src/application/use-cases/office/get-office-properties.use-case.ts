import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from 'src/domain/repositories/property.repository';
 
@Injectable()
export class GetOfficePropertiesUseCase {
  constructor( 
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,) {}

  async execute(officeId: number, propertyType?: string) {
    return this.propertyRepo.findOfficeProperties(officeId, propertyType);
  }
}
