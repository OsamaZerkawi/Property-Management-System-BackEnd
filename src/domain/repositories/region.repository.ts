
export const REGION_REPOSITORY = 'REGION_REPOSITORY';

export interface RegionRepositoryInterface {
    findByName(name: string);
    findById(regionId: number);
    getRegionsByCityId(cityId);
}