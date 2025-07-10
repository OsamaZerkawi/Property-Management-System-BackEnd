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

}
