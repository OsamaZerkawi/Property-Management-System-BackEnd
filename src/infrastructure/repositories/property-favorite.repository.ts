import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyFavorite } from "src/domain/entities/property-favorite.entity";
import { PropertyFavoriteRepositoryInterface } from "src/domain/repositories/property-favorite.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class PropertyFavoriteRepository implements PropertyFavoriteRepositoryInterface {
    constructor(
        @InjectRepository(PropertyFavorite)
        private readonly propertyFavoriteRepo: Repository<PropertyFavorite>,
    ){}
    
    async addPropertyToFavorite(id: number, userId: number) {
        const favorite = this.propertyFavoriteRepo.create({
            user: {id: userId},
            property: {id},
        });

        await this.propertyFavoriteRepo.save(favorite);
    }

    async removePropertyFromFavorite(id: number, userId: number) {
        const favorite = await this.propertyFavoriteRepo.findOne({
            where: { 
                user: { id: userId},
                property: {id}
            }
        });

        if(!favorite){
            throw new NotFoundException(
                errorResponse('لا يوجد هذا العقار في المفضلة ',404)
            );
        }

        await this.propertyFavoriteRepo.delete(favorite.id);
    }
    
}