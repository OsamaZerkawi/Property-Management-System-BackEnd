import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { waitForDebugger } from 'inspector';
import { ServiceProviderFeedbackDto } from 'src/application/dtos/service-provider/service-provider-feedback.dto';
import { ServiceProviderFiltersDto } from 'src/application/dtos/service-provider/service-provider-filters.dto';
import { UpdateServiceProviderDto } from 'src/application/dtos/service-provider/update-service-provider.dto';
import { Region } from 'src/domain/entities/region.entity';
import { ServiceFeedback } from 'src/domain/entities/service-feedback.entity';
import { ServiceProvider } from 'src/domain/entities/service-provider.entity';
import { User } from 'src/domain/entities/user.entity';
import { ComplaintStatus } from 'src/domain/enums/complaint-status.enum';
import { ServiceProviderRepositoryInterface } from 'src/domain/repositories/service-provider.repository';
import { DataSource, Repository } from 'typeorm';

export class ServiceProviderRepository
  implements ServiceProviderRepositoryInterface
{
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepo: Repository<ServiceProvider>,
    @InjectRepository(ServiceFeedback)
    private readonly feedbackRepo: Repository<ServiceFeedback>,
     private readonly dataSource: DataSource,
  ) {}
  async findAll(baseUrl: string) {
    const query = await this.fetchServiceProviders(baseUrl);

    const result = await query.getRawMany();
    return result;
  }

  async findAllByCityId(cityId: number, baseUrl: string) {
    const query = await this.fetchServiceProviders(baseUrl);
    query.andWhere('city.id = :cityId', { cityId });

    const result = await query.getRawMany();
    return result;
  }

  async getAll(baseUrl: string, page?: number, items?: number) {
    const query = await this.fetchServiceProviders(baseUrl, page, items);
    const results = await query.getRawMany();
    const total = results.length ? parseInt(results[0].total, 10) : 0;

    return { results, total };
  }

  async getAllWithFilters(
    baseUrl: string,
    filters: ServiceProviderFiltersDto,
    page?: number,
    items?: number,
  ) {
    const query = await this.fetchServiceProviders(
      baseUrl,
      page,
      items,
      filters,
    );
    const results = await query.getRawMany();
    const total = results.length ? parseInt(results[0].total, 10) : 0;

    return { results, total };
  }

  async searchByName(
    name: string,
    baseUrl: string,
    page?: number,
    items?: number,
  ) {
    const query = await this.fetchServiceProviders(baseUrl,page,items);
    query.andWhere('service_provider.name ILIKE :name', { name: `%${name}%` });
    const results = await query.getRawMany();
    const total = results.length ? parseInt(results[0].total, 10) : 0;
    return { results, total };
  }
  async findOneWithDetails(id: number, baseUrl: string) {
    console.log(baseUrl);
    return this.serviceProviderRepo
      .createQueryBuilder('sp')
      .leftJoin('sp.socials', 'social')
      .leftJoin('sp.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('sp.user', 'user')
      .leftJoin('sp.feedbacks', 'feedback', 'feedback.rate IS NOT NULL')
      .select([
        'sp.id AS "id"',
        'sp.name AS "name"',
        `CONCAT('${baseUrl}/uploads/providers/logo/', sp.logo) AS "logo"`,
        'sp.details AS "details"',
        'sp.career AS "career"',
        'city.name AS city_name',
        'region.name AS region_name',
        // `CONCAT(city.name, ', ', region.name) AS "location"`,e
        'user.phone AS "phone"',
        'sp.opening_time AS "opening_time"',
        'sp.closing_time AS "closing_time"',
        'sp.active::int AS active',
        'ROUND(COALESCE(AVG(feedback.rate), 0)::numeric, 1)::double precision AS "avgRate"',
        'CAST(COUNT(feedback.id) AS INTEGER) AS "ratingCount"',
      ])
      .where('sp.id = :id', { id })
      .groupBy('sp.id, region.id, city.id, user.id')
      .getRawOne();
  }
  private async fetchServiceProviders(
    baseUrl: string,
    page?: number,
    items?: number,
    filters?: ServiceProviderFiltersDto,
  ) {
    const query = this.serviceProviderRepo
      .createQueryBuilder('service_provider')
      .leftJoin('service_provider.user', 'user')
      .leftJoin('service_provider.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin(
        'service_provider.feedbacks',
        'feedback',
        'feedback.rate IS NOT NULL',
      )
      .where('service_provider.active = true');

    if (filters?.regionId) {
      query.andWhere('region.id = :regionId', { regionId: filters.regionId });
    }

    if (filters?.cityId) {
      query.andWhere('city.id = :cityId', { cityId: filters.cityId });
    }

    if (filters?.career) {
      query.andWhere('service_provider.career = :career', {
        career: filters.career,
      });
    }

    query
      .select([
        'service_provider.id AS id',
        'service_provider.name AS name',
        `CONCAT('${baseUrl}/uploads/providers/logo/', service_provider.logo) AS logo`,
        'service_provider.career AS career',
        'service_provider.opening_time AS opening_time',
        'service_provider.closing_time AS closing_time',
        `CONCAT(city.name, ' ، ', region.name) AS location`,
        'user.phone AS "userPhone"',
        'ROUND(COALESCE(AVG(feedback.rate), 0)::numeric, 1)::double precision AS "avgRate"',
        'CAST(COUNT(feedback.id) AS INTEGER) AS "ratingCount"',
        'COUNT(*) OVER() AS total',
      ])
      .groupBy('service_provider.id')
      .addGroupBy('region.id')
      .addGroupBy('city.id')
      .addGroupBy('user.id');
    //  .orderBy('service_provider.id', 'ASC');

    if (page && items) {
      query.offset((page - 1) * items).limit(items);
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
  async createOrUpdateFeedback(
    userId: number,
    serviceProviderId: number,
    data: ServiceProviderFeedbackDto,
  ) {
    let feedback = await this.feedbackRepo.findOne({
      where: {
        user: { id: userId },
        serviceProvider: { id: serviceProviderId },
      },
    });
    if (!feedback) {
      feedback = this.feedbackRepo.create({
        user: { id: userId },
        serviceProvider: { id: serviceProviderId },
        status:ComplaintStatus.PENDING,
      });
    }
    if (data.rate !== undefined) feedback.rate = data.rate;
    if (data.complaint !== undefined) feedback.complaint = data.complaint;

    return await this.feedbackRepo.save(feedback);
  }
  
   async findOneByUserId(userId: number): Promise<ServiceProvider | null> {
    return this.serviceProviderRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'region','region.city'],  
    });
  }

  async updateServiceProvider(
    serviceProviderId: number,
    options: { dto: UpdateServiceProviderDto; userId: number },
  ): Promise<void> {
    const { dto } = options;

    await this.dataSource.transaction(async (manager) => {
      const sp = await manager.findOne(ServiceProvider, {
        where: { id: serviceProviderId },
        relations: ['user', 'region'],
      });

      if (!sp) throw new NotFoundException('مزود الخدمة غير موجود');
 
      if (dto.region_id !== undefined) {
        const region = await manager.findOne(Region, { where: { id: dto.region_id } });
        if (!region) throw new NotFoundException('المنطقة غير موجودة');
        sp.region = region;
      }
 
      if (dto.name !== undefined) sp.name = dto.name;
      if (dto.details !== undefined) sp.details = dto.details;
      if (dto.career !== undefined) sp.career = dto.career;
      if (dto.opening_time !== undefined) sp.opening_time = dto.opening_time;
      if (dto.closing_time !== undefined) sp.closing_time = dto.closing_time;
      if (dto.status !== undefined) sp.active = Boolean(dto.status);
      if (dto.logo !== undefined) sp.logo = dto.logo;
 
      if (dto.phone !== undefined) {
        const user = await manager.findOne(User, { where: { id: sp.user.id } });
        if (!user) throw new NotFoundException('المستخدم المرتبط غير موجود');
        user.phone = dto.phone;
        await manager.save(User, user);
      }
 
      await manager.save(ServiceProvider, sp);

     });
  }

}
