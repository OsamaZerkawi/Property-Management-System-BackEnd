
export const STATS_REPOSITORY = 'STATS_REPOSITORY';

export interface StatsRepositoryInterface {
    getTopFiveOffices();
    getTopFiveServiceProviders();
    getPublicInfo();
}