import { InjectRepository } from "@nestjs/typeorm";
import { waitForDebugger } from "inspector";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";
import { Repository } from "typeorm";

export class ServiceProviderRepository implements ServiceProviderRepositoryInterface{
    constructor(
        @InjectRepository(ServiceProvider)
        private readonly serviceProviderRepo: Repository<ServiceProvider>,
    ){}

    async getAll() {
       const query = await this.fetchServiceProviders();
       return query.getRawMany();
    }

    async getAllWithFilters(filters: ServiceProviderFiltersDto) {
        const query = await this.fetchServiceProviders(filters);
        return  query.getRawMany();
    }

    async searchByName(name: string) {
        const query = await this.fetchServiceProviders();
        query.andWhere('service_provider.name ILIKE :name', { name: `%${name}%` });
        return query.getRawMany();
    }

    private async fetchServiceProviders(filters?: ServiceProviderFiltersDto){
        const query = this.serviceProviderRepo
            .createQueryBuilder('service_provider')
            .leftJoin('service_provider.user','user')
            .leftJoin('service_provider.region','region')
            .leftJoin('region.city','city')
            .leftJoin('service_provider.feedbacks','feedback')
            .where('service_provider.active = true')
            
        if (filters?.regionId) {
          query.andWhere('region.id = :regionId', { regionId: filters.regionId });
        }
    
        if (filters?.cityId) {
          query.andWhere('city.id = :cityId', { cityId: filters.cityId });
        }
    
        if (filters?.career) {
          query.andWhere('service_provider.career = :career', { career: filters.career });
        }

        query
        .select([
            'service_provider.id AS id',
            'service_provider.name AS name',
            'service_provider.logo AS logo',
            'service_provider.career AS career',
            'region.id AS region_id',
            'region.name AS region_name',
            'city.id AS city_id',
            'city.name AS city_name',
            'user.phone AS user_phone',
            'CAST(COALESCE(AVG(feedback.rate), 0) AS INTEGER) AS avgRating'
        ])
        .groupBy(`
            service_provider.id,
            region.id,
            city.id,
            user.id
        `)

        return query;
    }

    async findTopRatedServiceProviders(page: number, items: number) {
        return await this.serviceProviderRepo
            .createQueryBuilder('provider')
            .leftJoin('provider.feedbacks', 'feedbacks', 'feedbacks.rate IS NOT NULL')
            .leftJoin('provider.region', 'region')
            .leftJoin('region.city', 'city')
            .select([
              'provider.id AS id',
              'provider.name AS name',
              'provider.logo AS logo',
              'provider.career AS career',
              `CONCAT(city.name, ', ', region.name) AS location`,
              'COALESCE(AVG(feedbacks.rate), 0) AS avg_rate',
              'COUNT(feedbacks.id) AS rating_count',
              'COUNT(*) OVER() AS total_count',
            ])
            .groupBy('provider.id, region.id, city.id')
            .orderBy('avg_rate', 'DESC')
            .offset((page - 1) * items)
            .limit(items)
            .getRawMany();
    }
}