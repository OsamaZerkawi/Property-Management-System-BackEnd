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

 async execute(propertyId: number, baseUrl: string, currentUserId?: number) {
    const { raw, entities } = await this.tourismRepo.findPropertyDetails(propertyId, currentUserId);

    if (!entities || entities.length === 0) {
      throw new NotFoundException('العقار غير موجود');
    }

    const entity = entities[0];
    const row = raw[0] || {};
 
    const formatNumber2 = (val: any): number | null => {
      if (val === null || typeof val === 'undefined') return null;
  
      const n = Number(val);
      if (Number.isNaN(n)) return null; 
      return Math.round(n * 100) / 100;
    };

    const avg_rate = formatNumber2(row.avg_rate) ?? 0.00;  
    console.log(avg_rate)
    const office_rate = formatNumber2(row.office_rate)??0.00;  
    const office_feedback_count = row.office_feedback_count ? Number(row.office_feedback_count) : 0;
    const is_favorite = (() => {
      if (typeof row.is_favorite === 'boolean') return row.is_favorite;
      if (row.is_favorite === 't' || row.is_favorite === 'true') return true;
      if (row.is_favorite === 'f' || row.is_favorite === 'false') return false;
      return Boolean(row.is_favorite);
    })(); 

    const postImage = entity.post?.image ? `${baseUrl}/uploads/properties/posts/images/${entity.post.image}` : null;
    const images = (entity.images || []).map((img: any) =>
      img.image_path ? `${baseUrl}/uploads/properties/images/${img.image_path}` : null
    ).filter(Boolean);

    const dto = {
      propertyId: entity.id,
      postTitle: entity.post?.title ?? null,
      description: entity.post?.description ?? null,
      date: entity.post?.date ? (new Date(entity.post.date)).toISOString().slice(0,10) : null, // yyyy-mm-dd
      postImage,
      images,
      location: `${entity.region?.city?.name ?? ''}، ${entity.region?.name ?? ''}`.trim(),
      longitude: entity.longitude ?? null,
      latitude: entity.latitude ?? null,
      area: entity.area ?? null,
      roomCount: entity.room_count ?? null,
      livingRoomCount: entity.living_room_count ?? null,
      kitchenCount: entity.kitchen_count ?? null,
      bathroomCount: entity.bathroom_count ?? null,
      hasFurniture: entity.has_furniture ?? null,    
      avg_rate,  
      is_favorite,

      office:{
      id: entity.office?.id ?? null, 
      logo: `${baseUrl}/uploads/offices/logos/${entity.office?.logo}`,
      type: entity.office?.property_type,
      name: entity.office?.name ?? null,
      location: `${entity.office?.region?.city?.name ?? ''}، ${entity.office?.region?.name ?? ''}`.trim(),
      rate:office_rate,  
      rating_count:office_feedback_count,
      },

      price: entity.touristic ? Number(entity.touristic.price) : null,
      electricity: entity.touristic?.electricity ?? null,
      water: entity.touristic?.water ?? null,
      pool: entity.touristic?.pool ?? null,
      additionalServices: (entity.touristic?.additionalServices || []).map((rel:any)=> rel.service?.name).filter(Boolean),   
    };

    return dto;
  }
  
}