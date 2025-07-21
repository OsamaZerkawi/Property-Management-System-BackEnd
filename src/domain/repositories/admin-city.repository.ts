
export const ADMIN_CITY_REPOSITORY = 'ADMIN_CITY_REPOSITORY';

export interface AdminCityRepositoryInterface {
    findCityIdByUserId(userId: number);
}