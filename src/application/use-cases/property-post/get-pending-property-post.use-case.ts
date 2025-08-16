import { Inject, Injectable } from '@nestjs/common';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { ADMIN_CITY_REPOSITORY, AdminCityRepositoryInterface } from 'src/domain/repositories/admin-city.repository';
import {
  PROPERTY_POST_REPOSITORY,
  PropertyPostRepositoryInterface,
} from 'src/domain/repositories/property-post.repository';

@Injectable()
export class GetPendingPropertyPostsUseCase {
  constructor(
    @Inject(PROPERTY_POST_REPOSITORY)
    private readonly propertyPostRepo: PropertyPostRepositoryInterface,
  ) {}

  async execute(baseUrl: string, adminId: number) {
    const posts = await this.propertyPostRepo.findPendingPostsForAdmin(adminId);

    return posts.map((row) => {
      const baseInfo = {
        id: row.post_id,
        title: row.post_title,
        image: `${baseUrl}/uploads/properties/posts/images/${row.post_image}`,
        location: `${row.city_name}، ${row.region_name}`,
        office_name: row.office_name,
        office_location: `${row.office_city}، ${row.office_region}`,
        type: row.property_type,
      };

      if (row.residential_listing_type) {
        if (row.residential_listing_type === ListingType.RENT) {
          return {
            ...baseInfo,
            listing_type: row.residential_listing_type,
            rental_price: row.residential_rental_price,
            rental_period: row.residential_rental_period,
          };
        } else if (row.residential_listing_type === ListingType.SALE) {
          return {
            ...baseInfo,
            listing_type: row.residential_listing_type,
            selling_price: row.residential_selling_price,
          };
        }
      }

      if (row.touristic_price) {
        return {
          ...baseInfo,
          listing_type: ListingType.RENT,
          rental_period: 'يومي',
          price: row.touristic_price,
        };
      }

      return baseInfo;
    });
  }
}
