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

}
