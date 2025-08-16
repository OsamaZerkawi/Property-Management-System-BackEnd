// application/usecases/get-related-touristic.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { TourismRepository } from 'src/infrastructure/repositories/tourism.repository';
 
@Injectable()
export class GetRelatedTouristicUseCase {
  constructor(
         @Inject(TOURISM_REPOSITORY)
            private readonly tourismRepo: ITourismRepository,
  ) {}

    async execute( propertyId: number,userId:number, baseUrl: string) {
    const property = await this.tourismRepo.findPropertyWithTouristicAndPost(propertyId);
    if (!property) {
      throw new NotFoundException('العقار السياحي غير موجود');
    }

    const touristic = property.touristic;
    const targetPrice = Number(touristic.price);
    const minPrice = targetPrice * 0.8;
    const maxPrice = targetPrice * 1.2;

    const regionId = property.region?.id ?? null;
    const cityId = property.region?.city?.id ?? null;
    const tag = property.post?.tag ?? null;

    const raws = await this.tourismRepo.findRelatedTouristicProperties({
      PropertyId: property.id,
      targetPrice,
      minPrice,
      maxPrice,
      regionId,
      cityId,
      tag,
      userId,
      limit: 5,
    });

    return raws.map(r => {
      const postImage = r.post_image
        ? `${baseUrl}/uploads/properties/posts/images/${r.post_image}`
        : null;
      const location = [r.city_name, r.region_name].filter(Boolean).join(',');

      return {
        propertyId: Number(r.property_id),
        postTitle: r.post_title,
        date: r.post_date ? new Date(r.post_date).toISOString().slice(0, 10) : null,
        postImage,
        price: Number(r.touristic_price),
        location,
        avg_rate:r.avg_rate??0,
        is_favorite:r.is_favorite,
      };
    });
  }
}
