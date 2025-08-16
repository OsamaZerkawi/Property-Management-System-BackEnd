import { InjectRepository } from '@nestjs/typeorm';
import { Office } from 'src/domain/entities/offices.entity';
import { ServiceProvider } from 'src/domain/entities/service-provider.entity';
import { StatsRepositoryInterface } from 'src/domain/repositories/stats.repository';
import { DataSource, Repository } from 'typeorm';

export class StatsRepository implements StatsRepositoryInterface {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Office)
    private readonly officeRepo: Repository<Office>,
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepo: Repository<ServiceProvider>,
  ) {}

  async getPublicInfo() {
    const result = await this.dataSource.query(
      `
      SELECT
        -- Count only users who are NOT admins
        (
          SELECT COUNT(*)::int
          FROM "users" u
          WHERE NOT EXISTS (
            SELECT 1
            FROM "user_roles" ur
            WHERE ur.user_id = u.id
          )

        ) AS total_users,

        -- Count only admins
        (
          SELECT COUNT(*)::int
          FROM "users" u
          INNER JOIN "user_roles" ur ON ur.user_id = u.id
          INNER JOIN "roles" r ON r.id = ur.role_id
          WHERE r.name = 'مشرف'
        ) AS total_admins,

        -- Offices count
        (SELECT COUNT(*)::int FROM "offices") AS total_offices,

        -- Service providers count
        (SELECT COUNT(*)::int FROM "service_providers") AS total_service_providers,

        -- Sale properties (from residentials.listing_type)
        (
          SELECT COUNT(*)::int
          FROM "properties" p
          INNER JOIN "residentials" r ON r.property_id = p.id
          WHERE r.listing_type = 'بيع'
            AND p.is_deleted = false
        ) AS sale_properties,

        -- Rent properties (from residentials.listing_type)
        (
          SELECT COUNT(*)::int
          FROM "properties" p
          INNER JOIN "residentials" r ON r.property_id = p.id
          WHERE r.listing_type = 'أجار'
            AND p.is_deleted = false
        ) AS rent_properties,

        -- Touristic properties count
        (
          SELECT COUNT(*)::int
          FROM "touristic" t
          INNER JOIN "properties" p ON p.id = t.property_id
          WHERE p.is_deleted = false
        ) AS total_touristic,

        -- Total advertisements (active by date range)
        (
          SELECT COUNT(*)::int
          FROM "advertisements" a
          WHERE a.start_date IS NOT NULL
            AND a.start_date <= CURRENT_DATE
            AND a.start_date + (a.day_period || ' days')::interval >= CURRENT_DATE
            AND a.admin_agreement = 'مقبول'
        ) AS total_ads
        `,
    );

    return result[0];
  }

  async getTopFiveOffices() {
    return await this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.feedbacks', 'feedbacks', 'feedbacks.rate IS NOT NULL')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .select([
        'office.id AS id',
        'office.name AS name',
        'office.logo AS logo',
        'office.type AS type',
        'region.name AS region_name',
        'city.name AS city_name',
        `city.name || ', ' || region.name AS location`,
        'COUNT(*) OVER() AS total_count',

        'COALESCE(AVG(feedbacks.rate), 0) AS avg_rate',

        'COUNT(feedbacks.id) AS rating_count',
      ])
      .groupBy('office.id, region.id, city.id')
      .orderBy('avg_rate', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getTopFiveServiceProviders() {
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
      .limit(5)
      .getRawMany();
  }
}
