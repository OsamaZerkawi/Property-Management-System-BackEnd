// domain/repositories/tourism.repository.ts
import { Property } from '../entities/property.entity';
import { PropertyPost } from '../entities/property-posts.entitiy';
import { Touristic } from '../entities/touristic.entity';
import {UpdateTourismDto} from 'src/application/dtos/tourism/update-tourism.dto';
export const TOURISM_REPOSITORY = 'TOURISM_REPOSITORY';
export interface ITourismRepository {
  createProperty(info: Property): Promise<Property>;
  createPost(post: PropertyPost): Promise<PropertyPost>;
  createTouristicDetails(details: Touristic): Promise<Touristic>;
  addServicesToTouristic(touristicId: number, servicesIds: number[]): Promise<void>;
   findAllByOffice(officeId: number): Promise<Property[]>;
  findPropertyById(id: number): Promise<Property | null>;
  updateTourism(propertyId: number, dto: UpdateTourismDto): Promise<void>;
}
