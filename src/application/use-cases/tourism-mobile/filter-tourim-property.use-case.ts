import { Inject, Injectable } from '@nestjs/common'; 
import {   FilterTourismPropertiesDto } from 'src/application/dtos/tourism-mobile/filter-tourism-properties.dto';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
export interface PropertyResponse {
  propertyId: number;
  location: string;
  postImage: string | null;
  postTitle: string;
  price: number;
  is_favorite:boolean;
} 

@Injectable()
export class FilterTourismPropertiesUseCase {
  constructor(   
     @Inject(TOURISM_REPOSITORY)
      private readonly repo: ITourismRepository,  ) {}

 async execute(dto: FilterTourismPropertiesDto, page = 1, items = 10,baseUrl:string, userId?:number): Promise<{
  data: PropertyResponse[],
  total: number,
  currentPage: number,
  totalPages: number
}> {
const {data, total} = await this.repo.filter(dto, page, items,userId);

  const results = data.map((p) => ({
    propertyId: p.id,
    location: `${p.region.city.name}, ${p.region.name}`,
     postImage: p.post.image
      ? `${baseUrl}/uploads/properties/posts/images/${p.post.image}`
      : null, 
    postTitle: p.post.title,
    price: Number(p.touristic.price),
     is_favorite: p.is_favorite,
  }));

  return {
    data: results,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / items),
  };
} 
}