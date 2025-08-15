import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from 'src/domain/repositories/property.repository';
 
@Injectable()
export class GetOfficePropertiesUseCase {
  constructor( 
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,) {}

  async execute(
    page: number,
    items: number,
    baseUrl: string,
    officeId: number,
    propertyType?: string,
  ) {
    const { data: raws, total } = await this.propertyRepo.findOfficeProperties(
      page,
      items,
      officeId,
      propertyType,
    );

  const data = raws.map((item) => ({
      postImage: item.postimage
        ? `${baseUrl}/uploads/properties/posts/images/${item.postimage}`
        : null,
      postTitle: item.posttitle ?? null,
      location: item.location ?? null,
      type: item.type ?? null,
      price: Number(item.price )?? 0.00
    }));

    return { data, total };
  }

}
