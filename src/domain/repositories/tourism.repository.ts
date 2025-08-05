// domain/repositories/tourism.repository.ts
import { Property } from '../entities/property.entity';
import { PropertyPost } from '../entities/property-posts.entitiy';
import { Touristic } from '../entities/touristic.entity';
import {UpdateTourismDto} from 'src/application/dtos/tourism/update-tourism.dto';
import {FilterTourismDto} from 'src/application/dtos/tourism/filter-tourism.dto';
import { Region } from '../entities/region.entity';

export const TOURISM_REPOSITORY = 'TOURISM_REPOSITORY';
export interface ITourismRepository {
  createProperty(info: Property): Promise<Property>;
  createPost(post: PropertyPost): Promise<PropertyPost>;
  createTouristicDetails(details: Touristic): Promise<Touristic>;
  addServicesToTouristic(touristicId: number, servicesIds: number[]): Promise<void>;
  findAllByOffice(officeId: number);
  findPropertyById(id: number): Promise<Property | null>;
  updateTourism(propertyId: number, dto: UpdateTourismDto): Promise<void>;
  filterByOffice(officeId: number, filter: FilterTourismDto): Promise<Property[]>;
  findRegionById(id: number): Promise<Region | null>;
  searchByTitleAndOffice(userId: number, title: string): Promise<PropertyPost[]>;
  findFullPropertyDetails(propertyId: number, officeId: number): Promise<Property | null>;
}
