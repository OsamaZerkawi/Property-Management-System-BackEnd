import { Inject } from '@nestjs/common';
import { ExploreMapDto } from 'src/application/dtos/map/explore-map.dto';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';
import {
  PROPERTY_REPOSITORY,
  PropertyRepositoryInterface,
} from 'src/domain/repositories/property.repository';

export class ExploreMapUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(data: ExploreMapDto) {
    const [properties, offices] = await Promise.all([
      this.propertyRepo.findWithinBounds(data),
      this.officeRepo.findWithinBounds(data),
    ]);

    const markers = [
      ...properties.map((p) => ({
        id: p.id,
        lat: +p.latitude,
        lng: +p.longitude,
        type: p.property_type,
      })),
      ...offices.map((o) => ({
        id: o.id,
        lat: +o.latitude,
        lng: +o.longitude,
        type: 'مكتب',
      })),
    ];

    return markers;
  }
}
