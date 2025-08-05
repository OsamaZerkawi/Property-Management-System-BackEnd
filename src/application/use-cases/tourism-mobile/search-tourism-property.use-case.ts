// tourism.usecase.ts
import { Inject, Injectable } from '@nestjs/common'; 
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { successPaginatedResponse } from 'src/shared/helpers/response.helper';

@Injectable()
export class SearchTourismUseCase {
  constructor( 
      @Inject(TOURISM_REPOSITORY)
      private readonly repo: ITourismRepository, 
  ) {}

  async execute(
    search: string,
    page = 1,
    items = 10,
    baseUrl:string,
  ): Promise<any> {
    const { data, total } = await this.repo.searchByTitle(search, page, items);

    const results = data.map((p) => ({
      propertyId: p.id,
      location: `${p.region.city.name}, ${p.region.name}`,
       postImage: p.post.image
      ? `${baseUrl}/uploads/properties/posts/images/${p.post.image}`
      : null, 
      title: p.post.title,
      price: p.touristic.price,
    }));

    return successPaginatedResponse(results, total, page, items);
  }

}
