
export const PROPERTY_FAVORITE_REPOSITORY = 'PROPERTY_FAVORITE_REPOSITORY';

export interface PropertyFavoriteRepositoryInterface {
    addPropertyToFavorite(id: number,userId: number);
    removePropertyFromFavorite(id: number,userId: number);
}