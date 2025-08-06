// infrastructure/repositories/tourism.repository.impl.ts
import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository';
import { Property } from 'src/domain/entities/property.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { AdditionalService } from 'src/domain/entities/additional-service.entity';
import {UpdateTourismDto} from 'src/application/dtos/tourism/update-tourism.dto';
import { DataSource } from 'typeorm';
import { FilterTourismDto } from 'src/application/dtos/tourism/filter-tourism.dto';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { Region } from 'src/domain/entities/region.entity';
import { Service } from 'src/domain/entities/services.entity';
import * as fs from 'fs';
import * as path from 'path';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { PropertyType } from 'src/domain/enums/property-type.enum';
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
    private readonly dataSource: DataSource,
  ) {}

  async getServicesMapByNames(names: string[]) {
    const services = await this.serviceRepo
      .createQueryBuilder('service')
      .select(['service.id', 'service.name'])
      .where('service.name IN (:...names)', { names })
      .getMany();
  
    const nameToIdMap: Record<string, number> = {};
    services.forEach(service => {
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
async findAllByOffice(officeId: number) {
   const raws =  await this.propRepo
    .createQueryBuilder('property')
    .leftJoin('property.post', 'post')
    .leftJoin('property.region', 'region')
    .leftJoin('region.city', 'city')  
    .leftJoin('property.touristic', 'touristic')
    .where('property.office_id = :officeId', { officeId })
    .select([
      'property.id AS id',
      'post.title AS title',
      'region.name AS region',
      'city.name   AS city',
      'property.area AS area',
      'touristic.price AS price',
      'touristic.status AS status'
    ])
     .getRawMany();
    return raws.map(r => ({
    id:       r.id,
    title:    r.title,
    location: `${r.city}، ${r.region}`,   
    area:     Number(r.area.toFixed(1)),
    price:    Number(r.price),
    status:   r.status,
  }));
}

async findPropertyById(id: number): Promise<Property | null> {
  return this.propRepo.findOne({ where: { id }, relations: ['office'] });
}

 async updateTourism(propertyId: number, dto: UpdateTourismDto): Promise<void> {
  await this.dataSource.transaction(async manager => { 
    const [property, post, touristic] = await Promise.all([
      manager.findOne(Property, { where: { id: propertyId } }),
      manager.findOne(PropertyPost, { 
        where: { property: { id: propertyId } },
        relations: ['property']  
      }),
      manager.findOne(Touristic, { 
        where: { property: { id: propertyId } },
        relations: ['additionalServices'] 
      })
    ]);

    if (!property) throw new NotFoundException(
      errorResponse('Property not found',404)
    );
 
    const propertyUpdates: Partial<Property> = {};
    
    const propertyMappings = {
      region_id: () => propertyUpdates.region = { id: dto.region_id } as any,
      latitude: () => propertyUpdates.latitude = dto.latitude,
      longitude: () => propertyUpdates.longitude = dto.longitude,
      area: () => propertyUpdates.area = dto.area,
      room_count: () => propertyUpdates.room_count = dto.room_count,
      living_room_count: () => propertyUpdates.living_room_count = dto.living_room_count,
      kitchen_count: () => propertyUpdates.kitchen_count = dto.kitchen_count,
      bathroom_count: () => propertyUpdates.bathroom_count = dto.bathroom_count,
      has_furniture: () => propertyUpdates.has_furniture = dto.has_furniture
    };

    Object.entries(propertyMappings).forEach(([key, updateFn]) => {
      if (dto[key] !== undefined) updateFn();
    });

    if (Object.keys(propertyUpdates).length > 0) {
      await manager.update(Property, propertyId, propertyUpdates);
    }
 
    if (post) {
      const postUpdates: Partial<PropertyPost> = { date: new Date() };
       
      const currentArea = dto.area !== undefined ? dto.area : property.area;
      const currentTag = dto.tag !== undefined ? dto.tag : post.tag;
      
      if (dto.tag !== undefined || dto.area !== undefined) {
        postUpdates.title = `${currentTag} ${currentArea} م²`;
      }
      
      if (dto.description !== undefined) postUpdates.description = dto.description;
      if (dto.tag !== undefined) postUpdates.tag = dto.tag;
      if (dto.image !== undefined) {
        const shouldDeleteOldImage =  dto.image && post.image && dto.image !== post.image;
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
        postUpdates.image = dto.image
      };
      
      await manager.update(PropertyPost, post.id, postUpdates);
    }
 
    if (touristic) {
      const touristicUpdates: Partial<Touristic> = {};
      
      const touristicMappings = {
        price: () => touristicUpdates.price = dto.price,
        street: () => touristicUpdates.street = dto.street,
        electricity: () => touristicUpdates.electricity = dto.electricity,
        water: () => touristicUpdates.water = dto.water,
        pool: () => touristicUpdates.pool = dto.pool,
        status: () => touristicUpdates.status = dto.status
      };

      Object.entries(touristicMappings).forEach(([key, updateFn]) => {
        if (dto[key] !== undefined) updateFn();
      });

      if (Object.keys(touristicUpdates).length > 0) {
        await manager.update(Touristic, touristic.id, touristicUpdates);
      }
 
      if (dto.additional_services) {

        // Resolve names to Ids
        const nameToIdMap = await this.getServicesMapByNames(dto.additional_services);

        const currentServices = touristic.additionalServices?.map(s => s.service.id) || [];
        const newServices = Object.values(nameToIdMap);
 
        const toRemove = currentServices.filter(id => !newServices.includes(id));
        const toAdd = newServices.filter(id => !currentServices.includes(id));

        if (toRemove.length > 0) {
          await manager.delete(AdditionalService, {
            touristic: { id: touristic.id },
            service: In(toRemove)
          });
        }

        if (toAdd.length > 0) {
          const newRelations = toAdd.map(serviceId =>
            manager.create(AdditionalService, {
              touristic: { id: touristic.id },
              service: { id: serviceId }
            })
          );
          await manager.save(newRelations);
        }
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
    .leftJoin('region.city','city')
    .leftJoin('property.touristic', 'touristic')
    .where('property.office_id = :officeId', { officeId })
    .andWhere('property.property_type = :type',{type: PropertyType.TOURISTIC})
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
        postStatus: filter.status
      });
    } else {
       query.andWhere('post.status = :approvedStatus', {
        approvedStatus: PropertyPostStatus.APPROVED
      })
      .andWhere('touristic.status = :touristicStatus', {
        touristicStatus: filter.status
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
      'touristic.status as touristic_status'
    ])
    .getRawMany();

  return results.map(item => ({
    id: item.property_id,
    title: item.post_title,
    postImage: item.image
      ? `${baseUrl}/uploads/properties/posts/images/${item.image}`
      : null, 
    location: `${item.city_name}, ${item.region_name}`,
    area:  Number(item.property_area.toFixed(1)),
    price: Number(item.touristic_price),
    status: item.post_status === PropertyPostStatus.APPROVED 
            ? item.touristic_status 
            : item.post_status
  }));
}
 
private isPostStatus(status: string): boolean {
  return [
    PropertyPostStatus.PENDING,
    PropertyPostStatus.REJECTED
  ].includes(status as any);
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
    .leftJoin('region.city','city')
    .leftJoin('property.touristic', 'touristic')
    .where('property.office_id = :officeId', { officeId })
    .andWhere('post.title LIKE :searchTerm', { searchTerm: `%${searchTerm}%` }) // إضافة شرط البحث
    .select([
      'property.id AS id',
      'post.title AS title',
      // 'region.name AS region',
      // 'city.name AS city',
      `CONTACT(city.name , ', ' ,region.name) AS location`,
      'property.area AS area',
      'touristic.price AS price',
      'touristic.status AS status'
    ])
    .getRawMany();
}
 async findFullPropertyDetails(propertyId: number, officeId: number) {
  return await this.propRepo.findOne({
    where: { 
      id: propertyId,
      property_type: PropertyType.TOURISTIC,
      office: { id: officeId } 
    },
    relations: [ 
      'region',
      'region.city',
      'post',
      'touristic',
      'images',
      'touristic.additionalServices',
      'touristic.additionalServices.service', 
    ],
  });
}
}
