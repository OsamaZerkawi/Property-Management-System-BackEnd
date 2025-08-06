import { Inject } from "@nestjs/common";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { PROPERTY_FAVORITE_REPOSITORY, PropertyFavoriteRepositoryInterface } from "src/domain/repositories/property-favorite.repository";

export class GetFavoritePropertiesUseCase {
    constructor(
        @Inject(PROPERTY_FAVORITE_REPOSITORY)
        private readonly propertyFavoriteRepo: PropertyFavoriteRepositoryInterface,
    ){}

    async execute(userId: number,type: PropertyType,page: number,items: number,baseUrl: string){
        const {data , total} = await this.propertyFavoriteRepo.getFavoriteProperties(userId,type,page,items);

        const favorites = data.map(row => ({
          propertyId: row.property_id,
          postImage: `${baseUrl}/uploads/properties/posts/images/${row.image}`,
          postTitle: row.title,
          postDate: row.created_at,
          location: `${row.city}, ${row.region}`,
          price: +row.price,
          listingType:row.listing_type,
          type: row.type, 
          ...(row.listing_type === 'أجار' ? { rate: +row.rate } : {}),
        }));
    
        return { favorites, total };
    }
}