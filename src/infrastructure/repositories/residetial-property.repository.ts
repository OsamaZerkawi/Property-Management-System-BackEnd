import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { Residential } from "src/domain/entities/residential.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";
import { ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class ResidentialPropertyRepository implements ResidentialPropertyRepositoryInterface{
    constructor(
        @InjectRepository(Residential)
        private readonly residentialRepo: Repository<Residential>,
    ){}
    async createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto) {
       const { property, ownership_type, direction, listingType, rent_details, sell_details } = data;
       
       const baseData = { property, ownership_type, direction, listing_type: listingType };

        const listingData =
          listingType === ListingType.RENT
            ? {
                rentalPrice: rent_details?.rentalPrice,
                rental_period: rent_details?.rental_period,
              }
            : {
                selling_price: sell_details?.selling_price,
                installment_allowed: sell_details?.installment_allowed,
                installment_duration: sell_details?.installment_duration,
              };
      
        const residential = this.residentialRepo.create({ ...baseData, ...listingData });
        return await this.residentialRepo.save(residential);
  }

  async findById(id: any) {
    return await this.residentialRepo.findOne({
    where: { id },
    relations: {
      property: {
        region: {
          city: true,
        },
        office: true,
        post: true,
      },
    },
  });
  }

  async updateResidentialProperty(id: number, data: UpdateResidentialPropertyDetailsDto) {
      const residentialProperty = await this.residentialRepo.findOne({where: {id}});

      if(!residentialProperty){
        throw new NotFoundException(
          errorResponse('لا يوجد عقار سكني بهذا المعرف ',404)
        );
      }

      const hasValidData = Object.values(data).some(value => value !== undefined && value !== null);
      
      if(!hasValidData){
        return residentialProperty;
      }

      await this.residentialRepo
      .createQueryBuilder()
      .update(Residential)
      .set(data)
      .where("id = :id", { id })
      .execute();

      const updatedResidentialProperty = await this.residentialRepo
      .createQueryBuilder("residential")
      .where("residential.id = :id", { id })
      .getOne();

      return updatedResidentialProperty;
  }

  async searchFilteredResidentialsProperties(baseUrl: string, filters: ResidentialPropertiesSearchFiltersDto,page: number,items: number,userId: number) {
    const query = this.buildBaseQuery();
    const filterMap = this.getFilterMap();

    //Apply simple filters using the map
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && filterMap.has(key as keyof ResidentialPropertiesSearchFiltersDto)) {
        filterMap.get(key as keyof ResidentialPropertiesSearchFiltersDto)!(query, value);
      }
    });

    this.applyRoomDetailsFilter(query,filters.room_details);
    filters.tag && this.applyTagsFilters(query, filters.tag);

    query.select([      'property.id',
      'property.area',
      'property.region',
      'property.rate',
      
      'post.id',
      'post.title',
      'post.image',
      'post.status',
      'post.description',

      'residential.id',
      'residential.listing_type',
      'residential.selling_price',
      'residential.rentalPrice',
      'residential.rental_period',
      
      'region.id',
      'region.name',
      
      'city.id',
      'city.name'

    ]);

    if (userId) {
      query.addSelect(
            `CASE
               WHEN EXISTS(
                 SELECT 1 FROM property_favorites pf 
                 WHERE pf.property_id = property.id AND pf.user_id = :userId
               ) THEN true
               ELSE false
             END`,
            'is_favorite'
      )
      .setParameter('userId',userId)
    }

    query.addSelect(
      `CASE
         WHEN residential.listing_type = :rent THEN residential.rentalPrice
         ELSE residential.selling_price
       END`,
      'calculated_price'
    ).setParameters({
      rent: ListingType.RENT,
      yearly: RentalPeriod.YEARLY,
    });


    

    const [rawResults, total] = await Promise.all([
      query.skip((page - 1) * items).take(items).getRawAndEntities(),
      query.getCount(),
    ]);
  
    const entities = rawResults.entities;
    const raw = rawResults.raw;
  
  const final = entities.map((entity, index) => ({
    ...entity,
    property: {
      ...entity.property,
      calculated_price: Number(raw[index]?.calculated_price),
      is_favorite: raw[index]?.is_favorite === true || raw[index]?.is_favorite === 'true' ? 1 : 0,
    },
  }));

  const formatted = final.map((residential) => this.formatResidential(residential, baseUrl));

  return [formatted, total];
  }
  
  private formatResidential(residential,baseUrl: string) {
    const property = residential.property;
  
    const base = {
      propertyId: property.id,
      postTitle: property.post?.title ?? '',
      postDescription: property.post.description,
      postImage: `${baseUrl}/uploads/properties/posts/images/${property.post?.image ?? 'default.jpg'}`,
      location: `${property.region?.city?.name ?? ''}, ${property.region?.name ?? ''}`,
      is_favorite: property.is_favorite ? 1 : 0,
    };
  
    if (residential.listing_type === ListingType.RENT) {
      return {
        ...base,
        listing_type: 'أجار',
        price: property.calculated_price,
        rate:property.rate ?? null,
      };
    } else {
      return {
        ...base,
        listing_type: 'بيع',
        price: property.calculated_price,
      };
    }
  }

  private getFilterMap(){
    return new Map<keyof ResidentialPropertiesSearchFiltersDto, (query: any,value: any) => void>([
      ['regionId', (q, v) => q.andWhere('property.region_id = :regionId', { regionId: v })],
      ['listing_type', (q, v) => q.andWhere('residential.listing_type = :listing_type', { listing_type: v })],
      ['ownership_type', (q, v) => q.andWhere('residential.ownership_type = :ownership_type', { ownership_type: v })],
      ['status', (q, v) => q.andWhere('residential.status = :status', { status: v })],
      ['has_furniture', (q, v) => q.andWhere('property.has_furniture = :has_furniture', { has_furniture: v })],
      ['direction', (q, v) => q.andWhere('residential.direction = :direction', { direction: v })],
      ['minPrice', (q, v) => q.andWhere('(residential.rentalPrice >= :minPrice OR residential.selling_price >= :minPrice)', { minPrice: v })],
      ['maxPrice', (q, v) => q.andWhere('(residential.rentalPrice <= :maxPrice OR residential.selling_price <= :maxPrice)', { maxPrice: v })],
      ['minArea', (q, v) => q.andWhere('property.area >= :minArea', { minArea: v })],
      ['maxArea', (q, v) => q.andWhere('property.area <= :maxArea', { maxArea: v })],
      ['floor_number', (q, v) => q.andWhere('property.floor_number = :floor_number', { floor_number: v })],    
    ]);
  }

  private applyRoomDetailsFilter(query: any,roomDetails?: ResidentialPropertiesSearchFiltersDto['room_details']){
    if (!roomDetails) return; 

    const roomFilters = [
      { key: 'room_count', field: 'property.room_count' },
      { key: 'bedroom_count', field: 'property.bedroom_count' },
      { key: 'living_room_count', field: 'property.living_room_count' },
      { key: 'kitchen_count', field: 'property.kitchen_count' },
      { key: 'bathroom_count', field: 'property.bathroom_count' },
    ];

    roomFilters.forEach(({ key, field }) => {
      const value = roomDetails[key as keyof typeof roomDetails];
      if (value !== undefined) {
        query.andWhere(`${field} = :${key}`, { [key]: value });
      }
    });
  }

  private applyTagsFilters(query: any,tag: PropertyPostTag){
    if(tag){
      query.andWhere('post.tag = :tag', { tag });
    }
  }

  private buildBaseQuery(){
    return this.residentialRepo
      .createQueryBuilder('residential')
      .leftJoin('residential.property', 'property')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.post', 'post')
      .where('property.is_deleted = false')
      .andWhere('post.status = :status', { status: PropertyPostStatus.APPROVED });
  }
}