import { PropertyType } from "../enums/property-type.enum";

export const PROPERTY_FAVORITE_REPOSITORY = 'PROPERTY_FAVORITE_REPOSITORY';

export interface PropertyFavoriteRepositoryInterface {
    addPropertyToFavorite(id: number,userId: number);
    removePropertyFromFavorite(id: number,userId: number);
    getFavoriteProperties(userId: number,type: PropertyType,page: number,items: number);
}