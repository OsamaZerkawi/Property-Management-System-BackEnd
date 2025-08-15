import { 
  Injectable, 
  Inject,
  NotFoundException,
  UnauthorizedException,
  Logger 
} from '@nestjs/common';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository'; 
import { format } from 'date-fns';
@Injectable()
export class ShowTourismMobileUseCase { 
  constructor( 
    @Inject(TOURISM_REPOSITORY)
    private readonly tourismRepo: ITourismRepository,
  ) {}

  async execute(  propertyId: number,baseUrl:string)  {  

  const property = await this.tourismRepo.findTourismPropertyDetails(
    propertyId
  );

  if (!property) {
    throw new NotFoundException('العقار غير موجود');
  }
 
  const { post, touristic, images, region,office} = property;

  const dto = {
    propertyId:       property.id,
    postTitle:    post.title,
    description: post.description,
    date: format(post.date, 'yyyy-MM-dd'), 
    postImage: post.image
      ? `${baseUrl}/uploads/properties/posts/images/${post.image}`
      : null, 
    images: images.map(img =>
      `${baseUrl}/uploads/properties/images/${img.image_path}`
    ),  
    location: `${region.city.name}، ${region.name}`,   
    longitude: property.longitude,
    latitude: property.latitude,
    area:             property.area,
    roomCount:        property.room_count,
    livingRoomCount:  property.living_room_count,
    kitchenCount:     property.kitchen_count,
    bathroomCount:    property.bathroom_count,
    hasFurniture:     property.has_furniture,
    officeId:         property.office.id,
    officeName:       property.office.name,
    officeLocation: `${office.region.city.name}، ${office.region.name}`,
    price:            Number(touristic.price),
    electricity:      touristic.electricity,
    water:            touristic.water,
    pool:             touristic.pool,
 
    additionalServices: touristic.additionalServices.map(rel => rel.service.name),
  };

  return dto;
}

  
}