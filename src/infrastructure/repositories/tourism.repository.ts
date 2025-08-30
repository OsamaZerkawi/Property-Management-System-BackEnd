// infrastructure/repositories/tourism.repository.impl.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository';
import { Property } from 'src/domain/entities/property.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { AdditionalService } from 'src/domain/entities/additional-service.entity';
import { UpdateTourismDto } from 'src/application/dtos/tourism/update-tourism.dto';
import { DataSource } from 'typeorm';
import { FilterTourismDto } from 'src/application/dtos/tourism/filter-tourism.dto';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { Region } from 'src/domain/entities/region.entity';
import { Service } from 'src/domain/entities/services.entity';
import * as fs from 'fs';
import * as path from 'path';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import { FilterTourismPropertiesDto } from 'src/application/dtos/tourism-mobile/filter-tourism-properties.dto';
import { TouristicStatus } from 'src/domain/enums/touristic-status.enum';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { Calendar } from 'src/domain/entities/calendar.entity';
import { Booking } from 'src/domain/entities/booking.entity';
import { CalendarStatus } from 'src/domain/enums/calendar-status.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { InoviceReasons } from 'src/domain/enums/inovice-reasons.enum';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
import { InvoicePdfService } from 'src/application/services/invoice-pdf.service';

export interface FinanceRecord {
  startDate: string;
  endDate: string;
  userId: number;
  invoiceImage: string;
  price: number;
  status: string;
  reason: string;
}

@Injectable()
export class TourismRepository implements ITourismRepository {
  constructor(
    @InjectRepository(Property)
    private readonly propRepo: Repository<Property>,
    @InjectRepository(PropertyPost)
    private readonly postRepo: Repository<PropertyPost>,
    @InjectRepository(Touristic)
    private readonly tourRepo: Repository<Touristic>,
    @InjectRepository(AdditionalService)
    private readonly addServRepo: Repository<AdditionalService>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
    @InjectRepository(UserPropertyInvoice)
    private readonly invoiceRepo: Repository<UserPropertyInvoice>,
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
    private readonly invoicePdfService:InvoicePdfService,
    private readonly dataSource: DataSource,
  ) {}

  async getServicesMapByNames(names: string[]) {
    const services = await this.serviceRepo
      .createQueryBuilder('service')
      .select(['service.id', 'service.name'])
      .where('service.name IN (:...names)', { names })
      .getMany();

    const nameToIdMap: Record<string, number> = {};
    services.forEach((service) => {
      nameToIdMap[service.name] = service.id;
    });

    return nameToIdMap;
  }

  async getAdditionalServicesIdsByNames(names: string[]) {
    const servcies = await this.serviceRepo
      .createQueryBuilder('service')
      .select('service.id')
      .where('service.name IN (:...names)', { names })
      .getMany();

    return servcies.map((s) => s.id);
  }

  createProperty(info: Property) {
    return this.propRepo.save(info);
  }

  createPost(post: PropertyPost) {
    return this.postRepo.save(post);
  }

  createTouristicDetails(details: Touristic) {
    return this.tourRepo.save(details);
  }

  async addServicesToTouristic(touristicId: number, servicesIds: number[]) {
    const relations = servicesIds.map((serviceId) =>
      this.addServRepo.create({
        touristic: { id: touristicId } as any,
        service: { id: serviceId } as any,
      }),
    );
    await this.addServRepo.save(relations);
  }

  async findFiveTopRatedTourism(userId: number, baseUrl: string) {
    const raws = await this.propRepo
      .createQueryBuilder('property')
      .leftJoin('property.office', 'office')
      .leftJoin('property.post', 'post')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.touristic', 'touristic')
      .leftJoin('property.feedbacks', 'feedback')
      .where('office.user_id = :userId', { userId })
      .andWhere('property.property_type = :type', {
        type: PropertyType.TOURISTIC,
      })
      .andWhere('property.is_deleted = :isDeleted', { isDeleted: false })
      .select([
        'property.id as property_id',
        'post.title as post_title',
        'post.image as image',
        'region.name as region_name',
        'city.name as city_name',
        'property.area as property_area',
        'touristic.price as touristic_price',
        'post.status as post_status',
        'touristic.status as touristic_status',
        'COALESCE(AVG(feedback.rate), 0) AS avg_rate',
      ])
      .groupBy('property.id')
      .addGroupBy('post.title')
      .addGroupBy('post.image')
      .addGroupBy('region.name')
      .addGroupBy('city.name')
      .addGroupBy('touristic.price')
      .addGroupBy('post.status')
      .addGroupBy('touristic.status')
      .orderBy('avg_rate', 'DESC')
      .limit(5)
      .getRawMany();

    return raws.map((item) => ({
      id: item.property_id,
      title: item.post_title,
      postImage: item.image
        ? `${baseUrl}/uploads/properties/posts/images/${item.image}`
        : null,
      location: `${item.city_name}, ${item.region_name}`,
      area: Number(item.property_area.toFixed(1)),
      price: Number(item.touristic_price),
      status:
        item.post_status === PropertyPostStatus.APPROVED
          ? item.touristic_status
          : item.post_status,
      avg_rate: parseFloat(parseFloat(item.avg_rate).toFixed(1)),
    }));
  }
  async findAllByOffice(officeId: number, baseUrl: string) {
    const raws = await this.propRepo
      .createQueryBuilder('property')
      .leftJoin('property.post', 'post')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.touristic', 'touristic')
      .where('property.office_id = :officeId', { officeId })
      .andWhere('property.property_type = :type', {
        type: PropertyType.TOURISTIC,
      })
      .andWhere('property.is_deleted = :isDeleted', { isDeleted: false })
      .select([
        'property.id as property_id',
        'post.title as post_title',
        'post.image as image',
        'region.name as region_name',
        'city.name as city_name',
        'property.area as property_area',
        'touristic.price as touristic_price',
        'post.status as post_status',
        'touristic.status as touristic_status',
      ])
      .getRawMany();

    return raws.map((item) => ({
      id: item.property_id,
      title: item.post_title,
      postImage: item.image
        ? `${baseUrl}/uploads/properties/posts/images/${item.image}`
        : null,
      location: `${item.city_name}, ${item.region_name}`,
      area: Number(item.property_area.toFixed(1)),
      price: Number(item.touristic_price),
      status:
        item.post_status === PropertyPostStatus.APPROVED
          ? item.touristic_status
          : item.post_status,
    }));
  }

  async findPropertyById(id: number): Promise<Property | null> {
    return this.propRepo.findOne({ where: { id }, relations: ['office'] });
  }

  async updateTourism(
    propertyId: number,
    dto: UpdateTourismDto,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const [property, post, touristic] = await Promise.all([
        manager.findOne(Property, { where: { id: propertyId } }),
        manager.findOne(PropertyPost, {
          where: { property: { id: propertyId } },
          relations: ['property'],
        }),
        manager.findOne(Touristic, {
          where: { property: { id: propertyId } },
          relations: ['additionalServices', 'additionalServices.service'],
        }),
      ]);

      if (!property)
        throw new NotFoundException(errorResponse('Property not found', 404));

      const propertyUpdates: Partial<Property> = {};

      const propertyMappings = {
        region_id: () =>
          (propertyUpdates.region = { id: dto.region_id } as any),
        latitude: () => (propertyUpdates.latitude = dto.latitude),
        longitude: () => (propertyUpdates.longitude = dto.longitude),
        area: () => (propertyUpdates.area = dto.area),
        room_count: () => (propertyUpdates.room_count = dto.room_count),
        living_room_count: () =>
          (propertyUpdates.living_room_count = dto.living_room_count),
        kitchen_count: () =>
          (propertyUpdates.kitchen_count = dto.kitchen_count),
        bathroom_count: () =>
          (propertyUpdates.bathroom_count = dto.bathroom_count),
        bedroom_count: () =>
          (propertyUpdates.bedroom_count = dto.bedroom_count),
        has_furniture: () =>
          (propertyUpdates.has_furniture = dto.has_furniture),
      };

      Object.entries(propertyMappings).forEach(([key, updateFn]) => {
        if (dto[key] !== undefined) updateFn();
      });

      if (Object.keys(propertyUpdates).length > 0) {
        await manager.update(Property, propertyId, propertyUpdates);
      }

      if (post) {
        const postUpdates: Partial<PropertyPost> = { date: new Date() };

        if (post.status === PropertyPostStatus.REJECTED) {
          postUpdates.status = PropertyPostStatus.PENDING;
        }

        const currentArea = dto.area !== undefined ? dto.area : property.area;
        const currentTag = dto.tag !== undefined ? dto.tag : post.tag;

        if (dto.tag !== undefined || dto.area !== undefined) {
          postUpdates.title = `${currentTag} ${currentArea} م²`;
        }

        if (dto.description !== undefined)
          postUpdates.description = dto.description;
        if (dto.tag !== undefined) postUpdates.tag = dto.tag;
        if (dto.image !== undefined) {
          const shouldDeleteOldImage =
            dto.image && post.image && dto.image !== post.image;
          if (shouldDeleteOldImage) {
            const oldImagePath = path.join(
              process.cwd(),
              'uploads/properties/posts/images',
              post.image,
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
          postUpdates.image = dto.image;
        }

        await manager.update(PropertyPost, post.id, postUpdates);
      }

      if (touristic) {
        const touristicUpdates: Partial<Touristic> = {};

        const touristicMappings = {
          price: () => (touristicUpdates.price = dto.price),
          street: () => (touristicUpdates.street = dto.street),
          electricity: () => (touristicUpdates.electricity = dto.electricity),
          water: () => (touristicUpdates.water = dto.water),
          pool: () => (touristicUpdates.pool = dto.pool),
          status: () => (touristicUpdates.status = dto.status),
        };

        Object.entries(touristicMappings).forEach(([key, updateFn]) => {
          if (dto[key] !== undefined) updateFn();
        });

        if (Object.keys(touristicUpdates).length > 0) {
          await manager.update(Touristic, touristic.id, touristicUpdates);
        }

        if (dto.additional_services) {
          // Resolve names to Ids
          const nameToIdMap = await this.getServicesMapByNames(
            dto.additional_services,
          );

          const currentServices =
            touristic.additionalServices?.map((s) => s.service.id) || [];

          const newServices = Object.values(nameToIdMap);

          const toRemove = currentServices.filter(
            (id) => !newServices.includes(id),
          );
          const toAdd = newServices.filter(
            (id) => !currentServices.includes(id),
          );

          if (toRemove.length > 0) {
            await manager
              .createQueryBuilder()
              .delete()
              .from(AdditionalService)
              .where('touristicId = :touristicId', {
                touristicId: touristic.id,
              })
              .andWhere('serviceId IN (:...services)', { services: toRemove })
              .execute();
          }

          if (toAdd.length > 0) {
            const newRelations = toAdd.map((serviceId) =>
              manager.create(AdditionalService, {
                touristic: { id: touristic.id },
                service: { id: serviceId },
              }),
            );
            await manager.save(newRelations);
          }
        } else {
          await manager
            .createQueryBuilder()
            .delete()
            .from(AdditionalService)
            .where('touristicId = :touristicId', { touristicId: touristic.id })
            .execute();
        }
      }
    });
  }

  async filterByOffice(
    officeId: number,
    filter: FilterTourismDto,
    baseUrl: string,
  ): Promise<any[]> {
    const query = this.propRepo
      .createQueryBuilder('property')
      .leftJoin('property.post', 'post')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.touristic', 'touristic')
      .where('property.office_id = :officeId', { officeId })
      .andWhere('property.property_type = :type', {
        type: PropertyType.TOURISTIC,
      })
      .andWhere('property.is_deleted = :isDeleted', { isDeleted: false });

    if (filter.city) {
      query.andWhere('city.name LIKE :city', { city: `${filter.city}` });
    }

    if (filter.region) {
      query.andWhere('region.name LIKE :region', {
        region: `${filter.region}`,
      });
    }

    if (filter.status) {
      if (this.isPostStatus(filter.status)) {
        query.andWhere('post.status = :postStatus', {
          postStatus: filter.status,
        });
      } else {
        query
          .andWhere('post.status = :approvedStatus', {
            approvedStatus: PropertyPostStatus.APPROVED,
          })
          .andWhere('touristic.status = :touristicStatus', {
            touristicStatus: filter.status,
          });
      }
    }

    const results = await query
      .select([
        'property.id as property_id',
        'post.title as post_title',
        'post.image as image',
        'region.name as region_name',
        'city.name as city_name',
        'property.area as property_area',
        'touristic.price as touristic_price',
        'post.status as post_status',
        'touristic.status as touristic_status',
      ])
      .orderBy('touristic.created_at', 'ASC')
      .getRawMany();

    return results.map((item) => ({
      id: item.property_id,
      title: item.post_title,
      postImage: item.image
        ? `${baseUrl}/uploads/properties/posts/images/${item.image}`
        : null,
      location: `${item.city_name}, ${item.region_name}`,
      area: Number(item.property_area.toFixed(1)),
      price: Number(item.touristic_price),
      status:
        item.post_status === PropertyPostStatus.APPROVED
          ? item.touristic_status
          : item.post_status,
    }));
  }

  private isPostStatus(status: string): boolean {
    return [PropertyPostStatus.PENDING, PropertyPostStatus.REJECTED].includes(
      status as any,
    );
  }

  async findRegionById(id: number): Promise<Region | null> {
    if (!id || id <= 0) {
      return null;
    }

    try {
      const region = await this.regionRepo.findOne({
        where: { id },
      });

      return region || null;
    } catch (error) {
      console.error('فشل في البحث عن المنطقة:', error);
      throw new Error('حدث خطأ أثناء البحث عن المنطقة');
    }
  }

  async searchByTitleAndOffice(officeId: number, searchTerm: string) {
    return await this.propRepo
      .createQueryBuilder('property')
      .leftJoin('property.post', 'post')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.touristic', 'touristic')
      .where('property.office_id = :officeId', { officeId })
      .andWhere('post.title LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      }) // إضافة شرط البحث
      .select([
        'property.id AS id',
        'post.title AS title',
        // 'region.name AS region',
        // 'city.name AS city',
        `CONTACT(city.name , ', ' ,region.name) AS location`,
        'property.area AS area',
        'touristic.price AS price',
        'touristic.status AS status',
      ])
      .getRawMany();
  }
  async findFullPropertyDetails(propertyId: number, officeId: number) {
    const qb = this.propRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.region', 'region')
      .leftJoinAndSelect('region.city', 'city')
      .leftJoinAndSelect('property.post', 'post')
      .leftJoinAndSelect('property.touristic', 'touristic')
      .leftJoinAndSelect('property.images', 'images')
      .leftJoinAndSelect('touristic.additionalServices', 'additionalServices')
      .leftJoinAndSelect('additionalServices.service', 'service')
      .addSelect(
        (subQb) =>
          subQb
            .select('ROUND(AVG(pf.rate)::numeric, 2)')
            .from('property_feedbacks', 'pf')
            .where('pf.property_id = property.id'),
        'avg_rate',
      )
      .where('property.id = :propertyId', { propertyId })
      .andWhere('property.property_type = :type', {
        type: PropertyType.TOURISTIC,
      })
      .andWhere('property.office_id = :officeId', { officeId });

    const { entities, raw } = await qb.getRawAndEntities();

    if (!entities[0]) return null;

    // أرجع الـ entity + القيمة المحسوبة
    return {
      ...entities[0],
      avgRate: raw[0]?.avg_rate ? Number(raw[0].avg_rate) : null,
    };
  }

  async findPropertyDetails(propertyId: number, userId?: number) {
    const qb = this.propRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.post', 'post')
      .leftJoinAndSelect('property.images', 'images')
      .leftJoinAndSelect('property.touristic', 'touristic')
      .leftJoinAndSelect('touristic.additionalServices', 'touristic_additional')
      .leftJoinAndSelect('touristic_additional.service', 'service')
      .leftJoinAndSelect('property.region', 'region')
      .leftJoinAndSelect('region.city', 'city')
      .leftJoinAndSelect('property.office', 'office')
      .leftJoinAndSelect('office.region', 'office_region')
      .leftJoinAndSelect('office_region.city', 'office_city')
      .where('property.id = :propertyId', { propertyId });

    qb.addSelect(
      (subQb) =>
        subQb
          .select('ROUND(AVG(pf.rate)::numeric, 2)')
          .from('property_feedbacks', 'pf')
          .where('pf.property_id = property.id'),
      'avg_rate',
    );

    if (userId) {
      qb.addSelect(
        (subQb) =>
          subQb
            .select('CASE WHEN COUNT(*) > 0 THEN true ELSE false END')
            .from('property_favorites', 'fav')
            .where('fav.property_id = property.id')
            .andWhere('fav.user_id = :userId', { userId }),
        'is_favorite',
      );
      qb.addSelect(
        (subQb) =>
          subQb
            .select('pfu.rate')
            .from('property_feedbacks', 'pfu')
            .where('pfu.property_id = property.id')
            .andWhere('pfu.user_id = :userId', { userId })
            .andWhere('pfu.rate IS NOT NULL')
            .limit(1),
        'user_rate',
      );
    } else {
      qb.addSelect('false', 'is_favorite');
      qb.addSelect('NULL', 'user_rate');
    }
    qb.addSelect(
      (subQb) =>
        subQb
          .select('ROUND(AVG(of.rate)::numeric, 2)')
          .from('office_feedbacks', 'of')
          .where('of.office_id = office.id'),
      'office_rate',
    );

    qb.addSelect(
      (subQb) =>
        subQb
          .select('COUNT(of2.id)')
          .from('office_feedbacks', 'of2')
          .where('of2.office_id = office.id')
          .andWhere('of2.rate IS NOT NULL'),
      'office_feedback_count',
    );
    const result = await qb.getRawAndEntities();
    return result;
  }

  async filter(
    dto: FilterTourismPropertiesDto,
    page: number,
    items: number,
    userId?: number,
  ) {
    const qb = this.propRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.region', 'region')
      .leftJoinAndSelect('region.city', 'city')
      .leftJoinAndSelect('property.touristic', 'touristic')
      .leftJoinAndSelect('property.post', 'post')
      .where('touristic.status = :tourStatus', {
        tourStatus: TouristicStatus.AVAILABLE,
      })
      .andWhere('post.status = :postStatus', {
        postStatus: PropertyPostStatus.APPROVED,
      });

    if (dto.regionId)
      qb.andWhere('region.id = :regionId', { regionId: dto.regionId });
    if (dto.cityId) qb.andWhere('city.id = :cityId', { cityId: dto.cityId });
    if (dto.tag)
      qb.andWhere('post.tag::text LIKE :tag', { tag: `%${dto.tag}%` });

    if (userId) {
      qb.addSelect(
        `CASE
        WHEN EXISTS (
          SELECT 1 FROM property_favorites pf
          WHERE pf.property_id = property.id AND pf.user_id = :userId
        ) THEN true
        ELSE false
      END`,
        'is_favorite',
      ).setParameter('userId', userId);
    } else {
      qb.addSelect('false', 'is_favorite');
    }

    let firstOrder = true;
    if (dto.orderByArea) {
      qb.orderBy('property.area', dto.orderByArea);
      firstOrder = false;
    }
    if (dto.orderByPrice) {
      if (firstOrder) {
        qb.orderBy('touristic.price', dto.orderByPrice);
        firstOrder = false;
      } else {
        qb.addOrderBy('touristic.price', dto.orderByPrice);
      }
    }
    if (dto.orderByDate) {
      if (firstOrder) {
        qb.orderBy('post.date', dto.orderByDate);
      } else {
        qb.addOrderBy('post.date', dto.orderByDate);
      }
    }
    const [rawResults, total] = await Promise.all([
      qb
        .offset((page - 1) * items)
        .limit(items)
        .getRawAndEntities(),
      qb.getCount(),
    ]);

    const data = rawResults.entities.map((entity, idx) => ({
      ...entity,
      is_favorite: rawResults.raw[idx].is_favorite,
    }));

    return { data, total };
  }

  async searchByTitle(
    title: string,
    page: number,
    items: number,
    userId: number,
  ): Promise<{ data: Property[]; total: number }> {
    const query = this.propRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.post', 'post')
      .leftJoinAndSelect('property.region', 'region')
      .leftJoinAndSelect('region.city', 'city')
      .innerJoinAndSelect('property.touristic', 'touristic')
      .where('LOWER(post.title) LIKE LOWER(:title)', { title: `%${title}%` });

    if (userId) {
      query
        .addSelect(
          `CASE
        WHEN EXISTS (
          SELECT 1 FROM property_favorites pf
          WHERE pf.property_id = property.id AND pf.user_id = :userId
        ) THEN true
        ELSE false
      END`,
          'is_favorite',
        )
        .setParameter('userId', userId);
    } else {
      query.addSelect('false', 'is_favorite');
    }

    const total = await query.getCount();

    const rawResults = await query
      .skip((page - 1) * items)
      .take(items)
      .getRawAndEntities();

    const data = rawResults.entities.map((entity, idx) => ({
      ...entity,
      is_favorite: rawResults.raw[idx].is_favorite,
    }));

    return { data, total };
  }

  async findByMonth(
    propertyId: number,
    year: number,
    month: number,
    baseUrl: string,
  ) {
    const raws = await this.invoiceRepo
      .createQueryBuilder('ui')
      .innerJoin('ui.calendar', 'c')
      .innerJoin('c.touristic', 't')
      .innerJoin('ui.user', 'u')
      .where('t.property_id = :pid', { pid: propertyId })
      .andWhere('EXTRACT(YEAR FROM c.start_date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM c.start_date) = :month', { month })
      .select([
        'ui.id AS "id"',
        'ui.paymentMethod AS "paymentMethod"',
        `TO_CHAR(c.start_date, 'YYYY-MM-DD') AS "startDate"`,
        `TO_CHAR(c.end_date, 'YYYY-MM-DD') AS "endDate"`,
        'u.phone AS "phone"',
        'ui.invoiceImage AS "invoiceImage"',
        'ui.amount AS "price"',
        'ui.status AS "status"',
        'ui.reason AS "reason"',
      ])
      .orderBy('c.start_date')
      .addOrderBy('ui.reason')
      .getRawMany();

    return raws.map((r) => ({
      id: r.id,
      paymentMethod: r.paymentMethod,
      startDate: r.startDate,
      endDate: r.endDate,
      phone: r.phone,
      invoiceImage: r.invoiceImage
        ? `${baseUrl}/uploads/properties/users/invoices/images/${r.invoiceImage}`
        : null,
      price: r.price,
      status: r.status,
      reason: r.reason,
    }));
  }

  async findPropertyWithTouristicAndPost(
    propertyId: number,
  ): Promise<Property | null> {
    return this.propRepo.findOne({
      where: { id: propertyId },
      relations: ['post', 'region', 'region.city', 'touristic'],
    });
  }
  async findPropertyWithTouristicAndOffice(
    propertyId: number,
  ): Promise<Property | null> {
    return this.propRepo.findOne({
      where: { id: propertyId },
      relations: ['office', 'touristic'],
    });
  }

  async findRelatedTouristicProperties(options: {
    PropertyId: number;
    targetPrice: number;
    minPrice: number;
    maxPrice: number;
    regionId?: number | null;
    cityId?: number | null;
    tag?: string | null;
    userId?: number | null;
    limit?: number;
  }): Promise<Array<Record<string, any>>> {
    const {
      PropertyId,
      minPrice,
      maxPrice,
      regionId,
      cityId,
      tag,
      userId = null,
      limit = 5,
    } = options;

    const priceScoreExpr = `
    GREATEST(
      0,
      (1 - (ABS(CAST(COALESCE(touristic.price, '0') AS numeric) - :targetPrice) / NULLIF(:targetPrice,0)) / 0.2)
    ) * 30
  `;

    const locScoreExpr = `(CASE WHEN region.id = :regionId THEN 40 WHEN city.id = :cityId THEN 25 ELSE 0 END)`;
    const tagScoreExpr = `(CASE WHEN post.tag = :tag THEN 20 ELSE 0 END)`;
    const priceDiffExpr = `ABS(CAST(COALESCE(touristic.price,'0') AS numeric) - :targetPrice)`;

    const buildScoredQB = (opts: {
      useRegion?: boolean;
      useCity?: boolean;
      excludeRegion?: number | null;
      excludeIds?: number[];
      maxResults?: number;
    }) => {
      const {
        useRegion = false,
        useCity = false,
        excludeRegion = null,
        excludeIds = [],
        maxResults = limit,
      } = opts;

      const qb = this.propRepo
        .createQueryBuilder('property')
        .leftJoin('property.post', 'post')
        .leftJoin('property.region', 'region')
        .leftJoin('region.city', 'city')
        .leftJoin('property.touristic', 'touristic')
        .where('property.id != :PropertyId', { PropertyId })
        .andWhere('property.is_deleted = false')
        .andWhere('post.status = :postStatus', { postStatus: 'مقبول' })
        .andWhere('touristic.status = :touristicStatus', {
          touristicStatus: 'متوفر',
        })
        .andWhere(
          "CAST(COALESCE(touristic.price, '0') AS numeric) BETWEEN :minPrice AND :maxPrice",
          { minPrice, maxPrice },
        );

      if (tag) {
        qb.andWhere('post.tag = :tag', { tag });
      }

      if (useRegion && regionId)
        qb.andWhere('region.id = :regionId', { regionId });
      if (useCity && cityId) qb.andWhere('city.id = :cityId', { cityId });
      if (excludeRegion)
        qb.andWhere('region.id != :excludeRegion', { excludeRegion });

      if (excludeIds && excludeIds.length > 0) {
        qb.andWhere('property.id NOT IN (:...excludeIds)', { excludeIds });
      }

      qb.select([
        'property.id AS property_id',
        'post.title AS post_title',
        'post.tag AS post_tag',
        'post.date AS post_date',
        'post.image AS post_image',
        'touristic.price AS touristic_price',
        'touristic.status AS touristic_status',
        'property.area AS property_area',
        'property.room_count AS property_room_count',
        'region.name AS region_name',
        'city.name AS city_name',
        `${locScoreExpr} AS loc_score`,
        `${tagScoreExpr} AS tag_score`,
        `(${priceScoreExpr}) AS price_score`,
        `(${locScoreExpr} + ${tagScoreExpr} + (${priceScoreExpr})) AS total_score`,
        `${priceDiffExpr} AS price_diff`,
      ]);

      qb.addSelect(
        (subQb) =>
          subQb
            .select('ROUND(AVG(pf.rate)::numeric, 2)')
            .from('property_feedbacks', 'pf')
            .where('pf.property_id = property.id'),
        'avg_rate',
      );

      if (userId) {
        qb.addSelect(
          (subQb) =>
            subQb
              .select('CASE WHEN COUNT(*) > 0 THEN true ELSE false END')
              .from('property_favorites', 'fav')
              .where('fav.property_id = property.id')
              .andWhere('fav.user_id = :userId', { userId }),
          'is_favorite',
        );
      } else {
        qb.addSelect('false', 'is_favorite');
      }

      qb.setParameters({
        targetPrice: options.targetPrice,
        regionId,
        cityId,
        tag,
        minPrice,
        maxPrice,
        postStatus: 'مقبول',
        touristicStatus: 'متوفر',
        userId,
      });
      qb.orderBy('total_score', 'DESC')
        .addOrderBy('price_diff', 'ASC')
        .addOrderBy('post.date', 'DESC')
        .limit(maxResults);

      return qb;
    };

    const results: Record<string, any>[] = [];

    if (regionId) {
      const qbRegion = buildScoredQB({ useRegion: true, maxResults: limit });
      const r1 = await qbRegion.getRawMany();
      results.push(...r1);
    }

    if (results.length < limit && cityId) {
      const foundIds = results.map((r) => Number(r.property_id));
      const remainingAfterRegion = limit - results.length;

      const qbCity = buildScoredQB({
        useCity: true,
        excludeRegion: regionId ?? null,
        excludeIds: foundIds,
        maxResults: remainingAfterRegion,
      });

      const r2 = await qbCity.getRawMany();
      results.push(...r2);
    }

    if (results.length < limit) {
      const foundIds = results.map((r) => Number(r.property_id));
      const remaining = limit - results.length;
      const qbAny = buildScoredQB({
        excludeIds: foundIds,
        maxResults: remaining,
      });
      const r3 = await qbAny.getRawMany();
      results.push(...r3);
    }

    return results.slice(0, limit);
  }

  async createBookingWithInvoices(options: {
    userId: number;
    propertyId: number;
    startDate: string;
    endDate: string;
    deposit: number;
    totalPrice: number;
    payment_id: string;
  }): Promise<any> {
    const {
      userId,
      propertyId,
      startDate,
      endDate,
      deposit,
      totalPrice,
      payment_id,
    } = options;

    return await this.dataSource.transaction(async (manager) => {
      const property = await manager.findOne(Property, {
        where: { id: propertyId },
        relations: ['touristic'],
      });

      if (!property) {
        throw new NotFoundException('العقار غير موجود');
      }

      const touristic = property.touristic;
      if (!touristic) {
        throw new NotFoundException('تفاصيل العقار السياحي غير موجودة');
      }

      const overlapExists = await manager
        .createQueryBuilder(Calendar, 'c')
        .where('c.touristic_id = :touristicId', { touristicId: touristic.id })
        .andWhere('c.status = :bookedStatus', { bookedStatus: 'محجوز' })
        .andWhere('NOT (c.end_date < :startDate OR c.start_date > :endDate)', {
          startDate,
          endDate,
        })
        .getCount();

      if (overlapExists > 0) {
        throw new BadRequestException(
          'المدى الزمني المطلوب متداخل مع حجز موجود',
        );
      }

      const calendar = manager.create(Calendar, {
        touristic: { id: touristic.id } as any,
        start_date: new Date(startDate).toISOString().split('T')[0],
        end_date: new Date(endDate).toISOString().split('T')[0],
        status: CalendarStatus.RESERVED,
      });
      await manager.save(Calendar, calendar);

      const booking = manager.create(Booking, {
        user: { id: userId } as any,
        calendar: { id: calendar.id } as any,
      });
      await manager.save(Booking, booking);

      const invoiceRepo = manager.getRepository(UserPropertyInvoice);

      const depositInvoiceData: DeepPartial<UserPropertyInvoice> = {
        user: { id: userId } as any,
        property: { id: propertyId } as any,
        calendar: calendar ? ({ id: calendar.id } as any) : undefined,
        amount: deposit,
        billing_period_start: new Date().toISOString().split('T')[0],
        reason: InoviceReasons.DEPOSIT,
        status: InvoicesStatus.PAID,
        paymentMethod: PaymentMethod.STRIPE,
        stripePaymentIntentId: payment_id,
      };

      const depositInvoice = invoiceRepo.create(depositInvoiceData);
      await invoiceRepo.save(depositInvoice);
      await this.generateAndUpdateInvoicePdf(manager, depositInvoice.id, payment_id);

      const remainingAmount = Number(totalPrice) - Number(deposit);
      const remainingInvoiceData: DeepPartial<UserPropertyInvoice> = {
        user: { id: userId } as any,
        property: { id: propertyId } as any,
        calendar: calendar ? ({ id: calendar.id } as any) : undefined,
        amount: remainingAmount >= 0 ? remainingAmount : 0,
        billing_period_start: new Date(),
        reason: InoviceReasons.TOURISTIC_BOOKING,
        status: InvoicesStatus.PENDING,
        paymentMethod: PaymentMethod.STRIPE,
        payment_deadline: startDate,
      };

      const remainingInvoice = invoiceRepo.create(remainingInvoiceData);
      await invoiceRepo.save(remainingInvoice);

    });
  }
    private parseToDate(value: any): Date | undefined|null {
      if (!value) return null;
      if (value instanceof Date) return value;
       const v = String(value);
       const isoDateMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoDateMatch) {
        const [_, y, m, d] = isoDateMatch;
        return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
      }
    }
    
      private toYMD(value: any): string {
      const d = this.parseToDate(value);
      return d ? d.toISOString().slice(0, 10) : '';
    }
      private async generateAndUpdateInvoicePdf(
      manager: EntityManager,
      invoiceId: number,
      paymentIntentId: string|null|undefined
    ) { 
      const invoice = await manager.findOne(UserPropertyInvoice, {
        where: { id: invoiceId },
        relations: ['user', 'property', 'property.post'],
      });
    
      if (!invoice) return;
     
      const payload = {
        invoiceId: invoice.id,
        createdAt: this.toYMD(invoice.created_at),
        amount: Number(invoice.amount || 0).toFixed(2),
        currency: 'SAR',
        reason: invoice.reason,
        status: invoice.status,
        paymentDate: new Date().toISOString().slice(0, 10),
        paymentIntentId: paymentIntentId,
        userName: invoice.user
          ? `${invoice.user.first_name || ''} ${invoice.user.last_name || ''}`.trim()
          : '',
        userPhone: invoice.user?.phone || '',
        postTitle: invoice.property?.post?.title || '',
        billingPeriodStart: this.toYMD(invoice.billing_period_start),
        paymentMethod: invoice.paymentMethod,
      };
     
      const { filename } = await this.invoicePdfService.generatePdf(payload);
     
      await manager.update(
        UserPropertyInvoice,
        invoice.id,
        { invoiceImage: filename }
      );
    }
  async findCalendarsForTouristicInRange(
    touristicId: number,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<
    Array<{ id: number; start_date: Date; end_date: Date; status: string }>
  > {
    return this.calendarRepo
      .createQueryBuilder('c')
      .where('c.touristic_id = :touristicId', { touristicId })
      .andWhere('NOT (c.end_date < :rangeStart OR c.start_date > :rangeEnd)', {
        rangeStart,
        rangeEnd,
      })
      .select([
        'c.id AS id',
        'c.start_date AS start_date',
        'c.end_date AS end_date',
        'c.status AS status',
      ])
      .getRawMany();
  }

  async findTopTouristicLocationsByOffice(officeId: number): Promise<string[]> {
    const raws = await this.calendarRepo
      .createQueryBuilder('c')
      .innerJoin('c.touristic', 't')
      .innerJoin('t.property', 'p')
      .innerJoin('p.region', 'r')
      .innerJoin('r.city', 'city')
      .where('p.office_id = :officeId', { officeId })
      .select([
        "city.name || '، ' || r.name AS location",
        'COUNT(c.id) AS requests',
      ])
      .groupBy('city.name, r.name')
      .orderBy('requests', 'DESC')
      .limit(10)
      .getRawMany();

    return raws.map((r) => String(r.location));
  }
}
