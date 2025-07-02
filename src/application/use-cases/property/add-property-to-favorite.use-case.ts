import { Inject } from "@nestjs/common";
import { PROPERTY_FAVORITE_REPOSITORY, PropertyFavoriteRepositoryInterface } from "src/domain/repositories/property-favorite.repository";

export class AddPropertyToFavoriteUseCase {
    constructor(
        @Inject(PROPERTY_FAVORITE_REPOSITORY)   
        private readonly propertyFavoriteRepo: PropertyFavoriteRepositoryInterface,
    ){}

    async execute(userId: number,propertyId: number){
        await this.propertyFavoriteRepo.addPropertyToFavorite(propertyId,userId);
    }
}