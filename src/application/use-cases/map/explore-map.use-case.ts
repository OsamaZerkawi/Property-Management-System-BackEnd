import { Inject } from '@nestjs/common';
import { ExploreMapDto } from 'src/application/dtos/map/explore-map.dto';
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

export class ExploreMapUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(data: ExploreMapDto, userId: number, baseUrl: string) {
    const [properties, offices] = await Promise.all([
      this.propertyRepo.findWithinBounds(data, userId),
      this.officeRepo.findWithinBounds(data),
    ]);

    const markers = [
      ...properties.map((p) => {
        const baseCard = {
          area: Number(Number(p.area).toFixed(2)),
          propertyId: p.property_id,
          postTitle: p.post_title,
          postImage: p.post_image
            ? `${baseUrl}/uploads/properties/posts/images/${p.post_image}`
            : null,
          location: `${p.city_name} - ${p.region_name}`,
          postDate: p.post_date
            ? new Date(p.post_date).toISOString().split('T')[0]
            : null,
          is_favorite:
            p.is_favorite === 'true' || p.is_favorite === true ? 1 : 0,
        };

        if (p.property_type === PropertyType.RESIDENTIAL) {
          return {
            id: p.property_id,
            lat: +p.latitude,
            lng: +p.longitude,
            type: PropertyType.RESIDENTIAL,
            card: {
              ...baseCard,
              type: PropertyType.RESIDENTIAL,
              listing_type: p.listing_type,
              price:
                p.listing_type === ListingType.SALE
                  ? Number(p.selling_price)
                  : Number(p.rental_price),
              rental_period:
                p.listing_type === ListingType.RENT
                  ? p.rental_period
                  : undefined,
              rate: parseFloat(parseFloat(p.avg_rate).toFixed(1)) || 0,
              rating_count: parseInt(p.rating_count) || 0,
            },
          };
        }

        if (p.property_type === PropertyType.TOURISTIC) {
          return {
            id: p.property_id,
            lat: +p.latitude,
            lng: +p.longitude,
            type: PropertyType.TOURISTIC,
            card: {
              ...baseCard,
              type: PropertyType.TOURISTIC,
              price: parseInt(p.touristic_price),
              rental_period: 'يومي',
              rate: parseFloat(parseFloat(p.avg_rate).toFixed(1)) || 0,
              rating_count: parseInt(p.rating_count) || 0,
            },
          };
        }
      }),
      ...offices.map((o) => ({
        id: o.id,
        lat: +o.latitude,
        lng: +o.longitude,
        type: 'مكتب',
        card: {
          id: o.id,
          name: o.name,
          logo: o.logo ? `${baseUrl}/uploads/offices/logos/${o.logo}` : null,
          type: o.type,
          location: o.location,
          rate: Number(parseFloat(o.avg_rate).toFixed(1)),
          rating_count: parseInt(o.rating_count),
        },
      })),
    ];

    return markers;
  }
}
