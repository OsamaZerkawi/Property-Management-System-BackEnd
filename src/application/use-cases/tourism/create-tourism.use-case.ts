// application/use-cases/tourism/create-tourism.use-case.ts
import { Injectable,NotFoundException ,Inject, BadRequestException} from '@nestjs/common';
import { ITourismRepository } from '../../../domain/repositories/tourism.repository';
import { CreateTourismDto } from 'src/application/dtos/tourism/create-tourism.dto';
import { Property } from 'src/domain/entities/property.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import { errorResponse } from 'src/shared/helpers/response.helper';
@Injectable()
export class CreateTourismUseCase {
  
  constructor(
    @Inject(TOURISM_REPOSITORY)
    private readonly repo: ITourismRepository,  
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
) {}

  async execute(userId: number, dto: CreateTourismDto) {
  const office = await this.officeRepo.findOneByUserId(userId); 
      if (!office) throw new NotFoundException('المكتب غير موجود');
  
    const property = new Property();  
      const region = await this.repo.findRegionById(dto.region_id);
  if (!region) throw new NotFoundException('المنطقة غير موجودة');
    Object.assign(property, {
      office: office,  
      region: region,
      latitude: dto.latitude,
      longitude: dto.longitude,
      area: dto.area,
      room_count: dto.room_count,
      living_room_count: dto.living_room_count,
      kitchen_count: dto.kitchen_count,
      bathroom_count: dto.bathroom_count,
      has_furniture: dto.has_furniture,
      property_type: PropertyType.TOURISTIC
    });
 
    const savedProperty = await this.repo.createProperty(property);
    const generatedTitle = `${dto.tag} ${dto.area} م²`;
    
    const post = new PropertyPost();
    Object.assign(post, {
      property: savedProperty,  
      title: generatedTitle,
      description: dto.description,
      tag: dto.tag,
      image: dto.image,
      date: new Date(),
    });
    await this.repo.createPost(post);
    
    const touristic = new Touristic();
    Object.assign(touristic, {
      property: savedProperty,  
      price: dto.price,
      street: dto.street,
      electricity: dto.electricity,
      water: dto.water,
      pool: dto.pool,
      status: "غير متوفر"
    });
    const savedTouristic = await this.repo.createTouristicDetails(touristic);
    
    if (dto.additional_services?.length) {
      const serviceIds = await this.repo.getAdditionalServicesIdsByNames(dto.additional_services);
      
      if(serviceIds.length !== dto.additional_services.length){
        throw new BadRequestException(
          errorResponse('واحد أو أكثر من المرفقات الإضافية غير صحيح',400)
        );
      }
      await this.repo.addServicesToTouristic(
        savedTouristic.id,
        serviceIds,
      );
    }
 
  }
}