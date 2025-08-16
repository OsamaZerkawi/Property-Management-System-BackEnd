import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from 'src/domain/repositories/property.repository';
 
@Injectable()
export class GetOfficePropertiesUseCase {
  constructor( 
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}
 
async execute(
  page: number,
  items: number,
  baseUrl: string,
  officeId: number,
  propertyType?: string,
  userId?:number
) {
  const office =  await this.officeRepo.findById(officeId);
  if (!office) throw new NotFoundException('المكتب غير موجود');

  const { data: raws, total } = await this.propertyRepo.findOfficeProperties(
    page,
    items,
    officeId,
    propertyType,
    userId,
  );

  const data = raws.map((item) => {
    const isResidential = item.type === 'عقاري'; 
    const postDate = item.post_date ? new Date(item.post_date).toISOString().slice(0, 10) : null;

    return {
      propertyId: Number(item.property_id),
      postTitle: item.post_title ?? null,
      postImage: item.post_image
        ? `${baseUrl}/uploads/properties/posts/images/${item.post_image}`
        : null,
      location: item.location ?? null,
      postDate,  
      is_favorite: item.is_favorite,  
      type: item.type ?? null,
 
      ...(isResidential ? {
        listing_type: item.listing_type ?? null, 
        rental_period: item.residential_rental_period ?? null,
      } : {}), 
      ...(isResidential ? {} : {
        rental_period: 'يومي',
      }),
      price: item.price !== null && item.price !== undefined ? Number(item.price) : 0,
      rate: item.avg_rate !== null && item.avg_rate !== undefined ? Number(item.avg_rate) : 0,
    };
  });

  return { data, total };
}

}
