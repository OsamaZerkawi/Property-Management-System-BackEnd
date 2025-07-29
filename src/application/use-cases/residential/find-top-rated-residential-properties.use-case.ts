import { Inject } from "@nestjs/common";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class FindTopRatedPropertiesUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(page: number,items: number,type: PropertyType,baseUrl: string,userId: number){
      const { raw,total} = await this.propertyRepo.getTopRatedProperties(page,items,type,userId);

      const results = raw.map(row => {
      const base = {
        propertyId: row.property_id,
        postTitle: row.post_title,
        postImage: `${baseUrl}/uploads/properties/posts/images/${row.post_image}`,
        location: `${row.city_name} - ${row.region_name}`,
        postDate: row.post_date ? new Date(row.post_date).toISOString().split('T')[0] : null,
        is_favorite: row.is_favorite === 'true' || row.is_favorite === true ? 1 : 0,
      };

        if (type === PropertyType.RESIDENTIAL) {
        
          return {
          ...base,
          type:PropertyType.RESIDENTIAL,
          listing_type: row.listing_type,
          price: row.listing_type === ListingType.SALE ? Number(row.selling_price) : Number(row.rental_price),
          rental_period: row.listing_type === ListingType.RENT ? row.rental_period : undefined,
          rate:  parseFloat(parseFloat(row.avg_rate).toFixed(1)) || 0,
          rating_count: parseInt(row.rating_count) || 0,
        };
      }
        if (type === PropertyType.TOURISTIC) {
        return {
          ...base,
          type:PropertyType.TOURISTIC,
          price: parseInt(row.touristic_price),
          rental_period:'يومي',
          rate:  parseFloat(parseFloat(row.avg_rate).toFixed(1)) || 0,
          rating_count: parseInt(row.rating_count) || 0,
        };
      }

      return base;
      });
      return { results , total};
    }
}