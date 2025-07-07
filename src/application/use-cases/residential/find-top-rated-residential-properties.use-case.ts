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
          id: row.property_id,
          title: row.post_title,
          image: `${baseUrl}/uploads/properties/posts/images/${row.post_image}`,
          location: `${row.city_name} - ${row.region_name}`,
          listing_type: row.listing_type,
          price: row.listing_type === ListingType.SALE ? row.selling_price : row.rental_price,
          rental_period: row.listing_type === ListingType.RENT ? row.rental_period : undefined,
          is_favorite: row.is_favorite === 'true' || row.is_favorite === true ? 1 : 0,
        };
      
        return row.listing_type === ListingType.RENT
          ? {
              ...base,
              avg_rate: parseFloat(row.avg_rate) || 0,
              rating_count: parseInt(row.rating_count) || 0,
            }
          : base;
      });
      return { results , total};
    }
}