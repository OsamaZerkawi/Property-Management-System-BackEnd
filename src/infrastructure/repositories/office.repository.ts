/* src/infrastructure/repositories/office.repository.ts */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Office } from 'src/domain/entities/offices.entity';
import { OfficeSocial } from 'src/domain/entities/office-social.entity';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateOfficeFeesDto } from 'src/application/dtos/office/Update-office-fees.dto';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { ExploreMapDto } from 'src/application/dtos/map/explore-map.dto';
import { OfficeFeedback } from 'src/domain/entities/office-feedback.entity';
import { SocialPlatform } from 'src/domain/entities/social_platforms.entity';
import {
  SocialItem,
  UpdateOfficeDto,
} from 'src/application/dtos/office/update-office.dto';
import { Region } from 'src/domain/entities/region.entity';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { PropertyStatus } from 'src/domain/enums/property-status.enum';
import { TouristicStatus } from 'src/domain/enums/touristic-status.enum';
import { Property } from 'src/domain/entities/property.entity';
import { User } from 'src/domain/entities/user.entity';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';

@Injectable()
export class OfficeRepository implements OfficeRepositoryInterface {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepo: Repository<Office>,
    @InjectRepository(OfficeSocial)
    private readonly socialRepo: Repository<OfficeSocial>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly dataSource: DataSource,
  ) {}
  async save(office: Office) {
    await this.officeRepo.save(office);
  }

  async findOfficesByCityId(cityId: number) {
    return this.baseOfficesQuery()
      .where('city.id = :cityId', { cityId })
      .getRawMany();
  }

  async findAllOffices() {
    return this.baseOfficesQuery().getRawMany();
  }

  private baseOfficesQuery() {
    return this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('office.feedbacks', 'feedback')
      .select([
        'office.id AS id',
        'office.logo AS logo',
        'office.name AS name',
        'office.type AS type',
        'office.created_at',
        'city.name AS city_name',
        'region.name AS region_name',
      ])
      .addSelect('AVG(feedback.rate)', 'avgRate')
      .addSelect(
        `COUNT(CASE WHEN feedback.rate IS NOT NULL THEN 1 END)`,
        'rateCount',
      )
      .groupBy('office.id')
      .addGroupBy('city.name')
      .addGroupBy('region.name')
      .orderBy('office.created_at', 'DESC');
  }

  async findOfficeByUserId(userId: number): Promise<Office | null> {
    return await this.dataSource.getRepository(Office).findOne({
      where: { user: { id: userId } },
      // select: { id: true }
    });
  }

  async findOneByUserId(userId: number): Promise<Office | null> {
    return this.officeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'region', 'region.city'],
    });
  }

  async getCommission(
    officeId: number,
  ): Promise<Pick<Office, 'id' | 'commission'> | null> {
    return this.officeRepo.findOne({
      where: { id: officeId },
      select: ['id', 'commission'],
    });
  }

  // async createOfficeWithSocials(
  //   userId: number,
  //   dto: CreateOfficeDto,
  // ): Promise<{ id: number }> {
  //   return this.dataSource.transaction(async (manager) => {
  //     const office = manager.create(Office, {
  //       user: { id: userId },
  //       name: dto.name,
  //       logo: dto.logo || undefined,
  //       type: dto.type,
  //       commission: dto.commission,
  //       booking_period: dto.booking_period,
  //       deposit_per_m2: dto.deposit_per_m2,
  //       tourism_deposit: dto.tourism_deposit,
  //       payment_method: dto.payment_method,
  //       opening_time: dto.opening_time,
  //       closing_time: dto.closing_time,
  //       latitude: dto.latitude,
  //       longitude: dto.longitude,
  //       region: { id: dto.region_id } as any,
  //     });

  //     await manager.save(office);

  //     if (dto.socials && dto.socials.length > 0) {
  //       const socials = dto.socials.map((s) =>
  //         manager.create(OfficeSocial, {
  //           office,
  //           platform: s.platform,
  //           link: s.link,
  //         }),
  //       );
  //       await manager.save(socials);
  //     }

  //     return { id: office.id };
  //   });
  // }

  async findById(id: number): Promise<Office | null> {
    return this.officeRepo.findOne({
      where: { id },
      relations: ['user', 'region', 'region.city'],
    });
  }
  async updateOfficeWithSocials(
    office: Office,
    dto: UpdateOfficeDto,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const officeId = office.id;
      const officeUpdateData: Partial<Office> = {};
//stripe_payment if true then the payment method is Stripe if false then its cach and it won't send the payment method directly
      for (const key of [
        'name',
        'logo',
        'type',
        'commission',
        'booking_period',
        'deposit_per_m2',
        'creditCard',
        'tourism_deposit', 
        'opening_time',
        'closing_time',
        'latitude',
        'longitude',
      ]) {
        if (dto[key] !== undefined) {
          officeUpdateData[key] = dto[key];
        }
       } 
       if(dto.stripe_payment!==undefined)
      {officeUpdateData.payment_method = dto.stripe_payment === 1? PaymentMethod.STRIPE: PaymentMethod.CASH;}

      if (dto.region_id !== undefined) {
        const region = await queryRunner.manager.findOne(Region, {
          where: { id: dto.region_id },
        });
        if (!region) {
          throw new NotFoundException('المنطقة غير موجودة');
        }
        officeUpdateData.region = region;
      }

      if (dto.phone !== undefined) {
        const user = await queryRunner.manager.findOne(User, {
          where: { id: office.user.id },
        });

        if (!user) {
          throw new NotFoundException('المستخدم المرتبط بالمكتب غير موجود');
        }

        user.phone = dto.phone;
        await queryRunner.manager.save(user);
      }

      if (Object.keys(officeUpdateData).length > 0) {
        await queryRunner.manager.update(Office, officeId, officeUpdateData);
      }
      if (dto.socials && dto.socials.length > 0) {
        for (const social of dto.socials) {
          const platform = await queryRunner.manager.findOne(SocialPlatform, {
            where: { id: social.id },
          });
          if (!platform) continue;

          let officeSocial = await queryRunner.manager.findOne(OfficeSocial, {
            where: { office: { id: officeId }, platform: { id: social.id } },
          });

          if (officeSocial) {
            officeSocial.link = social.link ?? officeSocial.link;
            await queryRunner.manager.save(officeSocial);
          } else if (social.link) {
            officeSocial = queryRunner.manager.create(OfficeSocial, {
              office: { id: officeId },
              platform: { id: social.id },
              link: social.link,
            });
            await queryRunner.manager.save(officeSocial);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getOfficeFees(userId: number) {
    const office = await this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.user', 'user')
      .where('user.id = :userId', { userId })
      .select([
        'office.id',
        'office.type',
        'office.deposit_per_m2',
        'office.commission',
        'office.booking_period',
        'office.tourism_deposit',
      ])
      .getOne();
    if (!office) {
      throw new NotFoundException(
        errorResponse('لا يوجد مكتب لهذا المعرف', 404),
      );
    }
    const result = {
      office_id: office.id,
      booking_period: office.booking_period,
      commission: Number(office.commission * 100),
      ...(office.deposit_per_m2 != null && {
        deposit_per_m2: Number(office.deposit_per_m2),
      }),
      ...(office.tourism_deposit != null && {
        tourism_deposit_percentage: Number(office.tourism_deposit * 100),
      }),
    };
    return result;
  }

  async findTopRatedOffices(page: number, items: number, baseUrl: string) {
    const rawData = await this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.feedbacks', 'feedbacks', 'feedbacks.rate IS NOT NULL') // فقط التقييمات الحقيقية
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
      .offset((page - 1) * items)
      .limit(items)
      .getRawMany();

    const data = rawData.map((item) => ({
      id: item.id,
      name: item.name,
      logo: item.logo ? `${baseUrl}/uploads/offices/logos/${item.logo}` : null,
      type: item.type,
      location: item.location,
      rate: parseFloat(item.avg_rate).toFixed(1),
      rating_count: parseInt(item.rating_count),
    }));

    const total = rawData[0]?.total_count
      ? parseInt(rawData[0].total_count)
      : 0;

    return { data, total };
  }

  async updateOfficeFees(userId: number, data: UpdateOfficeFeesDto) {
    const office = await this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!office) {
      throw new NotFoundException(
        errorResponse('لا يوجد مكتب عقاري مرتبط بهذا المستخدم', 404),
      );
    }

    Object.assign(office, {
      ...('booking_period' in data && { booking_period: data.booking_period }),
      ...('deposit_per_m2' in data && { deposit_per_m2: data.deposit_per_m2 }),
      ...('tourism_deposit_percentage' in data && {
        tourism_deposit_percentage: data.tourism_deposit_percentage,
      }),
    });

    await this.officeRepo.save(office);
  }

  async findWithinBounds(bounds: ExploreMapDto) {
    return await this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.feedbacks', 'feedbacks', 'feedbacks.rate IS NOT NULL')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .select([
        'office.id AS id',
        'office.latitude AS latitude',
        'office.longitude AS longitude',
        'office.name AS name',
        'office.logo AS logo',
        'office.type AS type',
        "city.name || ', ' || region.name AS location",
        'COALESCE(AVG(feedbacks.rate), 0) AS avg_rate',
        'COUNT(feedbacks.id) AS rating_count',
      ])
      .where('office.latitude BETWEEN :minLat AND :maxLat', {
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
      })
      .andWhere('office.longitude BETWEEN :minLng AND :maxLng', {
        minLng: bounds.minLng,
        maxLng: bounds.maxLng,
      })
      .andWhere('office.is_deleted = false')
      .andWhere('office.active = true')
      .groupBy('office.id, region.id, city.id')
      .getRawMany();
  }
  async findAllWithAvgRating(
    page: number,
    items: number,
    cityId?: number,
    regionId?: number,
    type?: string,
    rate?: number,
  ) {
    let query = this.officeRepo
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
        'COALESCE(AVG(feedbacks.rate), 0) AS avg_rate',
      ])
      .groupBy('office.id, region.id, city.id')
      .orderBy('avg_rate', 'DESC');

    if (cityId) query = query.andWhere('city.id = :cityId', { cityId });
    if (regionId) query = query.andWhere('region.id = :regionId', { regionId });
    if (type) query = query.andWhere('office.type = :type', { type });
    if (rate && rate >= 1 && rate <= 5) {
      query = query.having('AVG(feedbacks.rate) >= :rate', { rate });
    }

    const [data, total] = await Promise.all([
      query
        .offset((page - 1) * items)
        .limit(items)
        .getRawMany(),
      query.getCount(),
    ]);

    return { data, total };
  }

  async findByName(
    q: string,
    page: number,
    items: number,
  ): Promise<{ data: any[]; total: number }> {
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(items) || 10);

    const search = (q ?? '').trim();

    const likeParam = `%${search}%`;

    const baseQb = this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.feedbacks', 'feedbacks', 'feedbacks.rate IS NOT NULL')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .where('office.is_deleted = false');

    if (search.length > 0) {
      baseQb.andWhere('LOWER(office.name) LIKE LOWER(:q)', { q: likeParam });
    }

    const dataQb = baseQb
      .clone()
      .select([
        'office.id AS id',
        'office.name AS name',
        'office.logo AS logo',
        'office.type AS type',
        'region.name AS region_name',
        'city.name AS city_name',
        'COALESCE(AVG(feedbacks.rate), 0) AS avg_rate',
      ])
      .groupBy('office.id')
      .addGroupBy('region.id')
      .addGroupBy('city.id')
      .orderBy('avg_rate', 'DESC')
      .offset((currentPage - 1) * pageSize)
      .limit(pageSize);

    const countQb = this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .where('office.is_deleted = false');

    if (search.length > 0) {
      countQb.andWhere('LOWER(office.name) LIKE LOWER(:q)', { q: likeParam });
    }

    countQb.select('COUNT(DISTINCT office.id)', 'total');

    const [data, countRaw] = await Promise.all([
      dataQb.getRawMany(),
      countQb.getRawOne(),
    ]);

    const total = countRaw && countRaw.total ? parseInt(countRaw.total, 10) : 0;

    return { data, total };
  }

  async rateAnOffice(userId: number, officeId: number, rate: number) {
    await this.dataSource.transaction(async (manager) => {
      let feedback = await manager.findOne(OfficeFeedback, {
        where: {
          office: { id: officeId } as any,
          user: { id: userId } as any,
        },
      });

      const now = new Date();

      if (feedback) {
        feedback.rate = rate;
        if ('updated_at' in feedback) (feedback as any).updated_at = now;
        await manager.save(OfficeFeedback, feedback);
      } else {
        feedback = manager.create(OfficeFeedback, {
          office: { id: officeId } as any,
          user: { id: userId } as any,
          rate,
          created_at: now as any,
          updated_at: now as any,
        });
        await manager.save(OfficeFeedback, feedback);
      }
    });
  }
  async createComplaint(
    userId: number,
    officeId: number,
    complaintText: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const now = new Date();

      const complaint = manager.create(OfficeFeedback, {
        office: { id: officeId } as any,
        user: { id: userId } as any,
        complaint: complaintText,
        created_at: now,
        updated_at: now,
      });

      await manager.save(OfficeFeedback, complaint);
    });
  }
  async findOfficeDetailsById(officeId: number, baseUrl: string) {
    const raw = await this.officeRepo
      .createQueryBuilder('office')
      .leftJoin('office.user', 'user')
      .leftJoin('office.feedbacks', 'fb')
      .leftJoin('office.socials', 'social')
      .leftJoin('social.platform', 'platform')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .where('office.id = :officeId', { officeId })
      .andWhere('office.is_deleted = false')
      .select([
        'office.id AS id',
        'office.logo AS logo',
        'office.name AS name',
        'office.type AS type',
        'office.latitude AS latitude',
        'office.longitude AS longitude',
        'office.opening_time AS opening_time',
        'office.closing_time AS closing_time',
        'region.name AS region_name',
        'city.name AS city_name',
        'user.phone AS phone',
        'COALESCE(AVG(fb.rate), 0.00) AS avg_rate',
        `COALESCE(
         json_agg(
           DISTINCT jsonb_build_object(
             'platform', platform.name,
             'link', social.link
           )
         ) FILTER (WHERE social.id IS NOT NULL),
         '[]'
       ) AS socials`,
      ])
      .groupBy(
        'office.id, office.logo, office.name, office.type, office.opening_time, office.closing_time, user.phone, region.name, city.name',
      )
      .getRawOne();

    if (!raw) return null;

    const socials =
      typeof raw.socials === 'string' ? JSON.parse(raw.socials) : raw.socials;
    const location = `${raw.city_name ?? ''}، ${raw.region_name ?? ''}`;

    return {
      id: Number(raw.id),
      logo: raw.logo ? `${baseUrl}/uploads/offices/logos/${raw.logo}` : null,
      name: raw.name,
      type: raw.type ?? null,
      city_name: raw.city_name,
      region_name: raw.region_name,
      location,
      longitude: raw.longitude,
      latitude: raw.latitude,
      rate: raw.avg_rate !== null ? Number(raw.avg_rate) : 0.0,
      opening_time: raw.opening_time ?? null,
      closing_time: raw.closing_time ?? null,
      phone: raw.phone ?? null,
      socials,
    };
  }
  async getOfficeDashboardByOfficeId(officeId: number): Promise<any | null> {
    const qb = this.dataSource
      .createQueryBuilder()
      .select('office.id', 'id')
      .addSelect('office.name', 'name')
      .addSelect('office.logo', 'logo')
      .addSelect('office.profits', 'profits')
      .addSelect('region.name', 'region_name')
      .addSelect('city.name', 'city_name')

      .addSelect(
        (subQb) =>
          subQb
            .select('COALESCE(ROUND(AVG(of.rate)::numeric, 1), 0)')
            .from('office_feedbacks', 'of')
            .where('of.office_id = office.id'),
        'avg_rate',
      )

      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)')
            .from('office_feedbacks', 'of')
            .where('of.office_id = office.id')
            .andWhere('of.complaint IS NOT NULL')
            .andWhere('of.status = :acceptedStatus', {
              acceptedStatus: 'مقبول',
            }),
        'complaints_count',
      )

      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)')
            .from('properties', 'p')
            .where('p.office_id = office.id')
            .andWhere('p.property_type = :touristicType', {
              touristicType: 'سياحي',
            }),
        'touristic_count',
      )

      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)')
            .from('properties', 'p2')
            .where('p2.office_id = office.id'),
        'total_properties',
      )

      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)')
            .from('properties', 'p3')
            .innerJoin('residentials', 'r3', 'r3.property_id = p3.id')
            .where('p3.office_id = office.id')
            .andWhere('p3.property_type = :resType', { resType: 'عقاري' })
            .andWhere('r3.listing_type = :sale', { sale: 'بيع' }),
        'residential_sale_count',
      )

      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)')
            .from('properties', 'p4')
            .innerJoin('residentials', 'r4', 'r4.property_id = p4.id')
            .where('p4.office_id = office.id')
            .andWhere('p4.property_type = :resType2', { resType2: 'عقاري' })
            .andWhere('r4.listing_type = :rent', { rent: 'أجار' }),
        'residential_rent_count',
      )

      .from('offices', 'office')
      .leftJoin('regions', 'region', 'region.id = office.region_id')
      .leftJoin('cities', 'city', 'city.id = region.city_id')
      .where('office.id = :officeId', { officeId });

    const raw = await qb.getRawOne();
    return raw || null;
  }

  async getAllSocialPlatformsWithOfficeLinks(
    officeId: number,
  ): Promise<Array<{ id: number; name: string; link: string | null }>> {
    const spRepo = this.dataSource.getRepository(SocialPlatform);
    const osRepo = this.dataSource.getRepository(OfficeSocial);

    const platforms = await spRepo.find({ order: { id: 'ASC' } });

    const officeSocials = await osRepo.find({
      where: { office: { id: officeId } as any },
      relations: ['platform'],
    });

    const linkMap = new Map<number, string | null>();
    for (const os of officeSocials) {
      if (os.platform && typeof os.platform.id === 'number') {
        linkMap.set(os.platform.id, os.link ?? null);
      }
    }

    return platforms.map((p) => ({
      id: p.id,
      name: p.name,
      link: linkMap.has(p.id) ? linkMap.get(p.id) ?? null : null,
    }));
  }
}
