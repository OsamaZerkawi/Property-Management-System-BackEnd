import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { PROMOTED_PROPERTY_REPOISTORY, PromotedPropertyRepositoryInterface } from "src/domain/repositories/promoted-property.repository";

export class GetPromotedPropertiesUseCase {
    constructor(
        @Inject(PROMOTED_PROPERTY_REPOISTORY)
        private readonly promotedPropertyRepo: PromotedPropertyRepositoryInterface,
    ){}

    async execute(page: number, items: number, userId: number, baseUrl: string) {
      const { raw, total } = await this.promotedPropertyRepo.getAllPromotedProperties(page, items, userId);
    
      const results = raw.map(row => {
        const base = {
          propertyId: row.property_id,
          postTitle: row.post_title,
          postImage: `${baseUrl}/uploads/properties/posts/images/${row.post_image}`,
          location: `${row.city_name}, ${row.region_name}`,
          postDate: row.post_date ? new Date(row.post_date).toISOString().split('T')[0] : null,
          is_favorite: row.is_favorite === 'true' || row.is_favorite === true ? 1 : 0,
        };
    
        if (row.listing_type === 'rent' || row.listing_type === 'أجار') {
          return {
            ...base,
            type: PropertyType.RESIDENTIAL,
            listing_type: 'أجار',
            rental_period: row.rental_period,
            price: row.rental_price,
            rate:  parseFloat(parseFloat(row.avg_rate).toFixed(1))  ?? null,
          };
        } else {
          return {
            ...base,
            type: PropertyType.RESIDENTIAL,
            listing_type: 'بيع',
            price: row.selling_price,
            area: parseFloat(parseFloat(row.avg_rate).toFixed(1))  || 0,
          };
        }
      });
    
      return {
        results,
        total,
      };
    }
}