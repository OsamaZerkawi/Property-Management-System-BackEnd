import { Inject, Injectable } from '@nestjs/common'; 
import {   FilterTourismPropertiesDto } from 'src/application/dtos/tourism-mobile/filter-tourism-properties.dto';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
export interface PropertyResponse {
  location: string;
  postImage: string;
  title: string;
  price: number;
}

@Injectable()
export class FilterTourismPropertiesUseCase {
  constructor(   
     @Inject(TOURISM_REPOSITORY)
      private readonly repo: ITourismRepository,  ) {}

  async execute(dto: FilterTourismPropertiesDto): Promise<PropertyResponse[]> {
    const properties = await this.repo.filter(dto);
    return properties.map((p) => ({
      location: `${p.region.city.name}, ${p.region.name}`,
      postImage: p.post.image,
      title: p.post.title,
      price: p.touristic.price,
    }));
  }
}