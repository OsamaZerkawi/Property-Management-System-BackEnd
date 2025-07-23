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
        is_favorite: row.is_favorite === 'true' || row.is_favorite === true ? 1 : 0,
      };

            if (type === PropertyType.RESIDENTIAL) {
        return {
          ...base,
          type:PropertyType.RESIDENTIAL,
          listing_type: row.listing_type,
          price: row.listing_type === ListingType.SALE ? Number(row.selling_price) : Number(row.rental_price),
          rental_period: row.listing_type === ListingType.RENT ? row.rental_period : undefined,
          avg_rate: parseFloat(row.avg_rate) || 0,
          rating_count: parseInt(row.rating_count) || 0,
        };
      }

        if (type === PropertyType.TOURISTIC) {
        return {
          ...base,
          type:PropertyType.TOURISTIC,
          price: parseInt(row.touristic_price),
          rental_period:'يومي',
          avg_rate: parseFloat(row.avg_rate) || 0,
          rating_count: parseInt(row.rating_count) || 0,
        };
      }

            return base;
}     );
      return { results , total};
    }
}