import { InjectRepository } from "@nestjs/typeorm";
import { waitForDebugger } from "inspector";
import { ServiceProviderFeedbackDto } from "src/application/dtos/service-provider/service-provider-feedback.dto";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";
import { ServiceFeedback } from "src/domain/entities/service-feedback.entity";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";
import { Repository } from "typeorm";

export class ServiceProviderRepository implements ServiceProviderRepositoryInterface{
  constructor(
      @InjectRepository(ServiceProvider)
      private readonly serviceProviderRepo: Repository<ServiceProvider>,
      @InjectRepository(ServiceFeedback)
      private readonly feedbackRepo: Repository<ServiceFeedback>,
  ){}
  async findAll(baseUrl: string) {
    const query = await this.fetchServiceProviders(baseUrl);

    const result = await query.getRawMany();
    return result;
  }

  async findAllByCityId(cityId: number, baseUrl: string) {
    const query = await this.fetchServiceProviders(baseUrl);
    query.andWhere('city.id = :cityId',{cityId})

    const result = await query.getRawMany();
    return result;
  }

  async getAll(baseUrl: string, page?: number, items?: number) {
    const query = await this.fetchServiceProviders(baseUrl);
  
    if (page && items) {
      const countQuery = query.clone();
      query.skip((page - 1) * items).take(items);
      const [results, total] = await Promise.all([query.getRawMany(), countQuery.getCount()]);
      return { results, total, page, items };
    }
  
    const results = await query.getRawMany();
    return { results };
  }
  
  async getAllWithFilters(baseUrl: string, filters: ServiceProviderFiltersDto, page?: number, items?: number) {
    const query = await this.fetchServiceProviders(baseUrl,page,items,filters);
  
    if (page && items) {
      const countQuery = query.clone();
      query.skip((page - 1) * items).take(items);
      const [results, total] = await Promise.all([query.getRawMany(), countQuery.getCount()]);
      return { results, total, page, items };
    }
  
    const results = await query.getRawMany();
    return { results };
  }
  
  async searchByName(name: string, baseUrl: string, page?: number, items?: number) {
    const query = await this.fetchServiceProviders(baseUrl);
    query.andWhere('service_provider.name ILIKE :name', { name: `%${name}%` });
    if (page && items) {
      const countQuery = query.clone();
      query.skip((page - 1) * items).take(items);
      const [results, total] = await Promise.all([query.getRawMany(), countQuery.getCount()]);
      return { results, total, page, items };
    }
  
    const results = await query.getRawMany();
    return { results };
  }
  async findOneWithDetails(id: number, baseUrl: string) {
    console.log(baseUrl)
    return this.serviceProviderRepo
      .createQueryBuilder('sp')
      .leftJoin('sp.socials','social')
      .leftJoin('sp.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('sp.user', 'user')
      .leftJoin('sp.feedbacks', 'feedback', 'feedback.rate IS NOT NULL')
      .select([
        'sp.id AS "id"',
        'sp.name AS "name"',
        `CONCAT('${baseUrl}/uploads/providers/logo', sp.logo) AS "logo"`,
        'sp.details AS "details"',
        'sp.career AS "career"',
        `CONCAT(city.name, ', ', region.name) AS "location"`,
        'user.phone AS "userPhone"',
        'sp.opening_time AS "openingTime"',
        'sp.closing_time AS "closingTime"',
        'sp.active::int AS active',
        'ROUND(COALESCE(AVG(feedback.rate), 0)::numeric, 1)::double precision AS "avgRate"',
        'CAST(COUNT(feedback.id) AS INTEGER) AS "ratingCount"',
                `COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'platform', social.platform,
              'link', social.link
            )
          ) FILTER (WHERE social.id IS NOT NULL),
          '[]'
        ) AS "socials"`
      ])
      .where('sp.id = :id', { id })
      .groupBy('sp.id, region.id, city.id, user.id')
      .getRawOne();
  }
  private async fetchServiceProviders(baseUrl: string,page?:number,items?: number,filters?: ServiceProviderFiltersDto,){
      const query = this.serviceProviderRepo
        .createQueryBuilder('service_provider')
        .leftJoin('service_provider.user', 'user')
        .leftJoin('service_provider.region', 'region')
        .leftJoin('region.city', 'city')
        .leftJoin('service_provider.feedbacks', 'feedback', 'feedback.rate IS NOT NULL')
        .where('service_provider.active = true');
    
      if (filters?.regionId) {
        query.andWhere('region.id = :regionId', { regionId: filters.regionId });
      }
    
      if (filters?.cityId) {
        query.andWhere('city.id = :cityId', { cityId: filters.cityId });
      }
    
      if (filters?.career) {
        query.andWhere('service_provider.career = :career', { career: filters.career });
      }
    
      query.select([
        'service_provider.id AS id',
        'service_provider.name AS name',
        `CONCAT('${baseUrl}/uploads/providers/logo', service_provider.logo) AS logo`,
        'service_provider.career AS career',
        'service_provider.opening_time AS opening_time',
        'service_provider.closing_time AS closing_time',
        `CONCAT(city.name, ' ، ', region.name) AS location`,
        'user.phone AS "userPhone"',
        'ROUND(COALESCE(AVG(feedback.rate), 0)::numeric, 1)::double precision AS "avgRate"',
        'CAST(COUNT(feedback.id) AS INTEGER) AS "ratingCount"',
      ])
      .groupBy(`
        service_provider.id,
        region.id,
        city.id,
        user.id
      `);
    
    
      if (page && items) {
        query.skip((page - 1) * items).take(items);
      }
    
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
        `ROUND(COALESCE(AVG(feedbacks.rate), 0)::numeric, 1)::double precision AS avg_rate`,
        'COUNT(feedbacks.id) AS rating_count',
        'COUNT(*) OVER() AS total_count',
      ])
      .groupBy('provider.id, region.id, city.id')
      .orderBy('avg_rate', 'DESC')
      .offset((page - 1) * items)
      .limit(items)
      .getRawMany();
  }
  async createOrUpdateFeedback(userId: number, serviceProviderId: number, data: ServiceProviderFeedbackDto) {
      let feedback = await this.feedbackRepo.findOne({
          where: {
              user: {id: userId},
              serviceProvider: {id: serviceProviderId},
          },
      });
      if(!feedback){
          feedback = this.feedbackRepo.create({
              user: {id: userId},
              serviceProvider: {id: serviceProviderId},
          });
      }
      if (data.rate !== undefined) feedback.rate = data.rate;
      if (data.complaint !== undefined) feedback.complaint = data.complaint;
    
      return await this.feedbackRepo.save(feedback);
  }
}