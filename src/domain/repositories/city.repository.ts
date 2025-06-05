
export const CITY_REPOSITORY = 'CITY_REPOSITORY';

export interface CityRepositoryInterface {
  findByName(name: string);
  getAllCities();
}