import { Inject, NotFoundException } from '@nestjs/common';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import {
  USER_POST_REPOSITORY,
  UserPostRepositoryInterface,
} from 'src/domain/repositories/user-post.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';

export class FindUserPostSuggestionsUseCase {
  constructor(
    @Inject(USER_POST_REPOSITORY)
    private readonly userPostRepo: UserPostRepositoryInterface,
  ) {}

  async execute(
    userId: number,
    page: number,
    items: number,
    userPostId: number,
    baseUrl: string,
  ) {
    const rows = await this.userPostRepo.findSuggestionsByUserPostId(
      userPostId,
      page,
      items,
      userId,
    );

    // if (!rows || rows.length === 0) {
    //   throw new NotFoundException(
    //     errorResponse('لا توجد اقتراحات لهذا الطلب', 404),
    //   );
    // }

    const total = rows.length > 0 ? parseInt(rows[0].total, 10) : 0;

    const suggestions = rows.map((row) => this.formatProperty(row, baseUrl));

    return { suggestions, total };
  }

  private formatProperty(row, baseUrl: string) {
    const base = {
      propertyId: row.property_id,
      postTitle: row.post_title,
      postImage: `${baseUrl}/uploads/properties/posts/images/${row.post_image}`,
      location: `${row.city_name}, ${row.region_name}`,
      postDate: new Date(row.post_created_at).toISOString().split('T')[0],
      is_favorite: row.is_favorite ? 1 : 0,
    };

    if (row.listing_type === ListingType.RENT) {
      return {
        ...base,
        type: PropertyType.RESIDENTIAL,
        listing_type: 'أجار',
        rental_period: row.rental_period,
        price: row.rental_price,
        rate: row.avg_rate ? Number(parseFloat(row.avg_rate).toFixed(1)) : null,
      };
    }

    return {
      ...base,
      listing_type: 'بيع',
      price: row.selling_price,
      area: parseInt(String(row.property_area), 10),
    };
  }
}
