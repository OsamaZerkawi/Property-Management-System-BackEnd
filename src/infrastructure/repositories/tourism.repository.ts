// infrastructure/repositories/tourism.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository';
import { Property } from 'src/domain/entities/property.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { Service } from 'src/domain/entities/services.entity';
import { AdditionalService } from 'src/domain/entities/additional-service.entity';
import {UpdateTourismDto} from 'src/application/dtos/tourism/update-tourism.dto';
import { DataSource } from 'typeorm';
import { FilterTourismDto } from 'src/application/dtos/tourism/filter-tourism.dto';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { TouristicStatus } from 'src/domain/enums/touristic-status.enum';
import { Region } from 'src/domain/entities/region.entity';
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
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
    private readonly dataSource: DataSource,
  ) {}

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
async findAllByOffice(officeId: number): Promise<Property[]> {
  console.log('office id',officeId);//2
  console.log(this.propRepo.metadata.targetName); //Property
    const res= await this.propRepo.find({
    where: { office: { id: officeId } },
    relations: [
      'post', 
      'touristic', 
      'touristic.additionalServices',
      'touristic.additionalServices.service'  
    ],
  });
  console.log('res ',res);// []
  return res;
}

async findPropertyById(id: number): Promise<Property | null> {
  return this.propRepo.findOne({ where: { id }, relations: ['office'] });
}

  async updateTourism(propertyId: number, dto: UpdateTourismDto): Promise<void> {
    await this.dataSource.transaction(async manager => { 
      await manager.update(Property, propertyId, {
        region: { id: dto.region_id } as any,
        latitude: dto.latitude,
        longitude: dto.longitude,
        area: dto.area,
        room_count: dto.room_count,
        living_room_count: dto.living_room_count,
        kitchen_count: dto.kitchen_count,
        bathroom_count: dto.bathroom_count,
        has_furniture: dto.has_furniture,
      });
 
      const post = await manager.findOne(PropertyPost, { where: { property: { id: propertyId } } });
      if (post) {
        const generatedTitle = `${dto.tag} ${dto.area} متر مربع`;
        await manager.update(PropertyPost, post.id, {
          title: generatedTitle,
          description: dto.description,
          tag: dto.tag,
          image: dto.image,
          date: new Date(),
        });
      }
 
      const touristic = await manager.findOne(Touristic, { where: { property: { id: propertyId } } });
      if (touristic) {
        await manager.update(Touristic, touristic.id, {
          price: dto.price,
          street: dto.street,
          electricity: dto.electricity,
          water: dto.water,
          pool: dto.pool,
          status: dto.status ?? touristic.status,
        });
 
        await manager.delete(AdditionalService, { touristic: { id: touristic.id } });
      
        if (dto.additional_services_ids?.length) {
          const relations = dto.additional_services_ids.map(serviceId =>
            manager.create(AdditionalService, {
              touristic: { id: touristic.id } as any,
              service:    { id: serviceId }   as any,
            })
          );
          await manager.save(relations);
        }
      }
    });
  }
async filterByOffice(
  officeId: number,
  filter: FilterTourismDto,
): Promise<any[]> { 
  let statusCondition = '';
  let statusParams: any = {};
  
  if (filter.status) {
    const mappedStatus = this.mapStatusBetweenEnums(filter.status);
    statusCondition = `(post.status = :postStatus OR touristic.status = :touristicStatus)`;
    statusParams = {
      postStatus: mappedStatus.postStatus,
      touristicStatus: mappedStatus.touristicStatus
    };
  }

  const query = this.propRepo
    .createQueryBuilder('property')
    .leftJoin('property.post', 'post')
    .leftJoin('property.region', 'region')
    .leftJoin('property.touristic', 'touristic')
    .where('property.office_id = :officeId', { officeId })
    .andWhere('property.is_deleted = :isDeleted', { isDeleted: false });
 
  if (filter.status) {
    query.andWhere(statusCondition, statusParams);
  }
 
  if (filter.city) {
    query.leftJoin('region.city', 'city')
         .andWhere('city.name LIKE :city', { city: `%${filter.city}%` });
  }

  if (filter.region) {
    query.andWhere('region.name LIKE :region', {
      region: `%${filter.region}%`,
    });
  }

  const results = await query
    .select([
      'property.id as property_id',
      'post.title as post_title',
      'region.name as region_name',
      'property.area as property_area',
      'touristic.price as touristic_price',
      'post.status as post_status',
      'touristic.status as touristic_status'
    ])
    .getRawMany();
 
  return results.map(item => {
    const finalStatus = item.post_status === PropertyPostStatus.APPROVED 
      ? item.touristic_status 
      : item.post_status;
    
    return {
      id: item.property_id,
      title: item.post_title,
      region: item.region_name,
      area: item.property_area,
      price: item.touristic_price,
      status: finalStatus
    };
  });
}

private mapStatusBetweenEnums(status: string): {
  postStatus: PropertyPostStatus;
  touristicStatus: TouristicStatus;
} {
  switch (status) {
    case PropertyPostStatus.PENDING:
      return {
        postStatus: PropertyPostStatus.PENDING,
        touristicStatus: TouristicStatus.UNAVAILABLE  
      };
    
    case PropertyPostStatus.APPROVED:
      return {
        postStatus: PropertyPostStatus.APPROVED,
        touristicStatus: TouristicStatus.AVAILABLE
      };
      
    case PropertyPostStatus.REJECTED:
      return {
        postStatus: PropertyPostStatus.REJECTED,
        touristicStatus: TouristicStatus.UNAVAILABLE
      };
      
    case TouristicStatus.AVAILABLE:
      return {
        postStatus: PropertyPostStatus.APPROVED,
        touristicStatus: TouristicStatus.AVAILABLE
      };
      
    case TouristicStatus.UNAVAILABLE:
      return {
        postStatus: PropertyPostStatus.PENDING, // أو REJECTED حسب منطقك
        touristicStatus: TouristicStatus.UNAVAILABLE
      };
      
    case TouristicStatus.UNDER_MAINTENANCE:
      return {
        postStatus: PropertyPostStatus.APPROVED,
        touristicStatus: TouristicStatus.UNDER_MAINTENANCE
      };
      
    case TouristicStatus.RESERVED:
      return {
        postStatus: PropertyPostStatus.APPROVED,
        touristicStatus: TouristicStatus.RESERVED
      };
      
    default:
      return {
        postStatus: PropertyPostStatus.PENDING,
        touristicStatus: TouristicStatus.UNAVAILABLE
      };
  }
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
}
