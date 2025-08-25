import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository';
import { format } from 'date-fns';
@Injectable()
export class ShowTourismUseCase {
  private readonly logger = new Logger(ShowTourismUseCase.name);

  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly tourismRepo: ITourismRepository,
  ) {}

  async execute(userId: number, propertyId: number, baseUrl: string) {
    const office = await this.officeRepo.findOneByUserId(userId);
    if (!office) throw new NotFoundException('المكتب غير موجود');

    const result = await this.tourismRepo.findFullPropertyDetails(
    propertyId,
    office.id,
  );

  const property = await this.tourismRepo.findFullPropertyDetails(
  propertyId,
  office.id,
);

if (!property) {
  throw new NotFoundException('العقار غير موجود أو لا ينتمي إلى مكتبك');
}

const { post, touristic, images, region } = property as any;
const rate = (property as any).avgRate;

const dto = {
  propertyId: property.id,
  title: post.title,
  description: post.description,
  date: format(post.date, 'yyyy-MM-dd'),
  tag: post.tag,
  postImage: post.image
    ? `${baseUrl}/uploads/properties/posts/images/${post.image}`
    : null,
  images: images.map((image) => ({
    id: image.id,
    image_url: `${baseUrl}/uploads/properties/images/${image.image_path}`,
  })),
  longitude: property.longitude,
  latitude: property.latitude,
  postStatus: post.status,
  status: touristic.status,
  region: region.name,
  city: region.city.name,
  street: touristic.street,
  area: property.area,
  roomCount: property.room_count,
  livingRoomCount: property.living_room_count,
  kitchenCount: property.kitchen_count,
  bathroomCount: property.bathroom_count,
  bedroomCount: property.bedroom_count,
  hasFurniture: property.has_furniture,

  price: Number(touristic.price),
  electricity: touristic.electricity,
  water: touristic.water,
  pool: touristic.pool,

  additionalServices: touristic.additionalServices.map(
    (rel) => rel.service.name,
  ), 
  rate,  
};

return dto;
  }
}
