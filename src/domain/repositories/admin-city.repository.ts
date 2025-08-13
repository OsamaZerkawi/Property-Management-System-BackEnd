export const ADMIN_CITY_REPOSITORY = 'ADMIN_CITY_REPOSITORY';

export interface AdminCityRepositoryInterface {
  findCityIdByUserId(userId: number);
  assignCityToAdmin(userId: number, cityId: number);
  updateAdminCity(userId: number, cityId: number);
  removeAdminCity(userId: number);
}
