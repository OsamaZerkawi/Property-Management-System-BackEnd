import { Inject, Injectable } from '@nestjs/common';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';

@Injectable()
export class GetTopRatedPropertiesForOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, type: PropertyType, baseUrl: string) {
    const raw = await this.officeRepo.findTopRatedPropertiesForOffice(
      userId,
      type,
    );

    const results = raw.map((row) => {
      const base = {
        propertyId: row.property_id,
        postTitle: row.post_title,
        postImage: row.post_image
          ? `${baseUrl}/uploads/properties/posts/images/${row.post_image}`
          : null,
        location: `${row.city_name} - ${row.region_name}`,
        postDate: row.post_date
          ? new Date(row.post_date).toISOString().split('T')[0]
          : null,
      };

      if (type === PropertyType.RESIDENTIAL) {
        return {
          ...base,
          type: PropertyType.RESIDENTIAL,
          listing_type: row.listing_type,
          price:
            row.listing_type === ListingType.SALE
              ? Number(row.selling_price)
              : Number(row.rental_price),
          rental_period:
            row.listing_type === ListingType.RENT
              ? row.rental_period
              : undefined,
          rate: parseFloat(parseFloat(row.avg_rate).toFixed(1)) || 0,
          rating_count: parseInt(row.rating_count) || 0,
        };
      }

      if (type === PropertyType.TOURISTIC) {
        return {
          ...base,
          type: PropertyType.TOURISTIC,
          price: parseInt(row.touristic_price),
          rental_period: 'يومي',
          rate: parseFloat(parseFloat(row.avg_rate).toFixed(1)) || 0,
          rating_count: parseInt(row.rating_count) || 0,
        };
      }

      return base;
    });

    return { results };
  }
}
