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
          area: parseInt(row.area),
          location: `${row.city}, ${row.region}`,
          price: +row.price,
          listing_type:row.listing_type,
          type: type,
          is_favorite: 1, 
          ...(row.listing_type === 'أجار' ? { rate: Number(parseFloat(row.avg_rate).toFixed(1)) } : {}),
        }));
    
        return { favorites, total };
    }
}