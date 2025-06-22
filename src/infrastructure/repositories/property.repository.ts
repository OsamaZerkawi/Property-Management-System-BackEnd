import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";
import { PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

@Injectable()
export class PropertyRepository implements PropertyRepositoryInterface {
  constructor(
      @InjectRepository(Property)
      private readonly propertyRepo: Repository<Property>,
  ){}

  async findByIdWithOwner(propertyId: number) {
      return await this.propertyRepo.findOne({
          where: {
              id: propertyId
          },
          relations: {office: {user: true}},
      });
  }
  
  async findById(id: number) {
    return await this.propertyRepo.findOne({
      where:{id}
    });
  }

  async findPropertyReservationDetails(id: number) {
    const result = await this.propertyRepo
        .createQueryBuilder('property')
        .leftJoin('property.residential', 'residential')
        .leftJoin('property.office', 'office')
        .where('residential.listing_type = :listingType', { listingType: ListingType.SALE })
        .andWhere('property.id = :id', { id })
        .select([
          'residential.selling_price AS residential_selling_price',
          '(residential.selling_price * office.commission) AS office_commission_amount',
          '(property.area * office.deposit_per_m2) AS total_deposit',
          '(residential.selling_price + (residential.selling_price * office.commission)) AS final_price'
        ])
        .getRawOne();

    if (!result) {
      throw new NotFoundException(
        errorResponse(`لم يتم العثور على العقار بالمعرّف ${id} أو أنه غير معروض للبيع.`,404)
      );
    }
  
    return result;

  }

  async findRelatedProperties(id: number, baseUrl: string) {
    const query = await this.createBasePropertyDetailsQuery().andWhere('property.id =:id',{id});

    const property = await query.getOne();

    if(!property){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار لهذا المعرف',404)
      );
    }

    const residential: Residential = property.residential;

    const listingType: ListingType = residential.listing_type;

    let price = 0;

    if(listingType == ListingType.SALE && residential.selling_price){
      price = residential.selling_price;
    }
    else if (listingType == ListingType.RENT && residential.monthly_price){
      price = residential.rental_period === RentalPeriod.YEARLY
        ? residential.monthly_price * 12
        : residential.monthly_price;
    }

    const minPrice = price * 0.8;
    const maxPrice = price * 1.2;

  const query2 = this.propertyRepo.createQueryBuilder('property')
      .leftJoin('property.residential', 'residential')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.post', 'post')
      .leftJoin('property.images', 'images')
      .where('property.id != :id', { id })
      .andWhere('property.is_deleted = false')
      .andWhere('residential.status = :resStatus',{resStatus: PropertyStatus.AVAILABLE})
      .andWhere('post.status = :postStatus', { postStatus: PropertyPostStatus.APPROVED })
      .andWhere('property.property_type = :type', { type: property.property_type })
      .andWhere('region.id = :regionId', { regionId: property.region?.id });  

    if (listingType === ListingType.SALE) {
      query2.andWhere('residential.selling_price BETWEEN :min AND :max', {
        min: minPrice,
        max: maxPrice,
      });
    } else if (listingType === ListingType.RENT) {
      query2.andWhere('residential.monthly_price BETWEEN :min AND :max', {
        min: minPrice,
        max: maxPrice,
      });
    }

    query2
    .select([
      'property.id',
      'property.area',
      'property.region',
      'property.rate',
  
      'post.id',
      'post.title',
      'post.description',
      'post.tag',
      'post.image',
      'post.status',
      'post.date',
  
      'residential.listing_type',
      'residential.selling_price',
      'residential.monthly_price',
      'residential.rental_period',
  
      'region.id',
      'region.name',
  
      'city.id',
      'city.name',
    ])
    .addSelect(
      `CASE
         WHEN residential.listing_type = :rent AND residential.rental_period = :yearly THEN residential.monthly_price * 12
         WHEN residential.listing_type = :rent THEN residential.monthly_price
         ELSE residential.selling_price
       END`,
      'calculated_price'
    )
    .setParameters({
      rent: ListingType.RENT,
      yearly: RentalPeriod.YEARLY,
    })
    .orderBy('post.date', 'DESC')
    .take(5);

    const properties = await query2.getMany();

    return properties.map((property) => this.formatProperty(property, baseUrl));
  }

  async createPropertyAndSaveIt(data: CreatePropertyDto) {
    const property = await this.propertyRepo.create({
        property_type:data.property_type,
        office:data.office,
        region:data.region,
        floor_number:data.floor_number,
        latitude:data.latitude,
        longitude:data.longitude,
        has_furniture:data.has_furniture,
        area:data.area,
        living_room_count:data.room_details.living_room_count,
        bedroom_count:data.room_details.bedroom_count,
        bathroom_count:data.room_details.bathroom_count,
        room_count:data.room_details.room_count,
        kitchen_count:data.room_details.kitchen_count,
    });
    
    return this.propertyRepo.save(property);
  }

  async updateProperty(id: number,data: UpdatePropertyDto) {
    const property = await this.propertyRepo.findOne({where:{id}});

    if(!property){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار بهذا المعرف',404)
      );
    }

    const updatePaylod = this.buildUpdatePayload(data);

    await this.propertyRepo
    .createQueryBuilder()
    .update(Property)
    .set(updatePaylod)
    .where("id = :id", { id })
    .execute();

    const updatedProeprty = await this.propertyRepo
    .createQueryBuilder('property')
    .leftJoinAndSelect('property.post','post')
    .where("property.id = :id", { id })
    .getOne();

    return updatedProeprty;
  }

  async findPropertiesByUserOffice(userId: number,baseUrl: string) {
    const query =  await this.createBasePropertyDetailsQuery()
    .andWhere('office.user_id = :userId', { userId });
    
    const properties = await query.getMany();


    return properties.map(property => this.formatPropertyDetails(property, baseUrl));
  }

  async findPropertyDetailsById(propertyId: number, baseUrl: string,userId: number) {
    const query = await this.createBasePropertyDetailsQuery()
    .andWhere('property.id = :propertyId',{propertyId});

    query.addSelect([
      'office.id',
      'office.name',
      'office.logo',
      'office.type',
    ]);

    if (userId) {
      query.addSelect(
        subQuery => {
          return subQuery
            .select('1')
            .from('property_favorites', 'pf')
            .where('pf.property_id = property.id')
            .andWhere('pf.user_id = :userId', { userId });
        },
        'is_favorite'
      );
    }

    const property = await query.getOne();

    if(!property){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار بهذا المعرف ',404)
      );  
    }

    const formatted = this.formatPropertyDetails(property,baseUrl);

    // should chage path of images for office's logo and add rate of office
    return {
      ...formatted,
      is_favorite: (property as any).is_favorite ? 1 : 0,
      office: {
        id: property.office?.id,
        name: property.office?.name,
        logo: property.office?.logo
          ? `${baseUrl}/uploads/offices/logos/${property.office.logo}`
          : null,
        type: property.office?.type ?? null,
      },
    };
  }

  async findPropertiesByUserOfficeWithFilters(userId: number, filters: SearchPropertiesDto,baseUrl: string) {
    const query =  await this.createBasePropertyDetailsQuery(filters)
    .andWhere('office.user_id = :userId', { userId });
    
    const properties = await query.getMany();

    
    return properties.map(property => this.formatPropertyDetails(property, baseUrl));
  }

  async searchPropertiesForOfficeByTitle(userId: number,title: string,baseUrl: string) {
    const query =  await this.createBasePropertyDetailsQuery()
    .andWhere('office.user_id = :userId', { userId })
    .andWhere('post.title ILIKE :title', { title: `%${title}%` });
    
    const properties =await query.getMany();

    return properties.map(property => this.formatPropertyDetails(property,baseUrl));
  }


  async findPropertyByPropertyIdAndUserOffice(userId: number,propertyId: number, baseUrl: string) {
    const property = await this.createBasePropertyDetailsQuery()
    .andWhere('office.user_id = :userId', { userId })
    .andWhere('property.id = :propertyId', { propertyId })
    .getOne();

    if(!property){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار بهذا المعرف ',404)
      );  
    }

    return this.formatPropertyDetails(property,baseUrl);
  }

  async getExpectedpPriceInRegion(propertyId: number) {
      const result = await this.propertyRepo
      .createQueryBuilder('property')
      .leftJoin('property.region','region')
      .where('property.id = :propertyId',{propertyId})
      .select([
        'property.id',
        'property.area as area',
        'region.id',
        'region.default_meter_price as default_meter_price',
      ])
      .getRawOne();

      if(!result){
        throw new NotFoundException(
          errorResponse('لم يتم العثور على العقار أو المنطقة',404)
        );
      }

      const area = Number(result.area);
      const pricePerMeter = Number(result.default_meter_price);
      const expectedPrice = area * pricePerMeter;

      return  {
        'expected_price': expectedPrice
      };
  }

  async getAllProperties(baseUrl: string,page: number,items: number,userId: number) {
    const query = await this.buildPropertyQuery(userId);

    const [rawResults, total] = await Promise.all([
      query.skip((page - 1) * items).take(items).getRawAndEntities(),
      query.getCount(),
    ]);
  
    const entities = rawResults.entities;
    const raw = rawResults.raw;
  
    const final = entities.map((entity, index) => ({
      ...entity,
      calculated_price: Number(raw[index]?.calculated_price),
      is_favorite: raw[index]?.is_favorite === true || raw[index]?.is_favorite === 'true' ? 1 : 0,
    }));
  
    return [final.map((p) => this.formatProperty(p, baseUrl)), total];
  }

  async getAllPropertiesWithFilters(baseUrl: string, filters: PropertiesFiltersDto,page: number,items: number,userId: number) {
    const query = await this.buildPropertyQuery(userId,filters);

    const [rawResults, total] = await Promise.all([
      query.skip((page - 1) * items).take(items).getRawAndEntities(),
      query.getCount(),
    ]);
  
    const entities = rawResults.entities;
    const raw = rawResults.raw;
  
    const final = entities.map((entity, index) => ({
      ...entity,
      calculated_price: Number(raw[index]?.calculated_price),
      is_favorite: raw[index]?.is_favorite === true || raw[index]?.is_favorite === 'true' ? 1 : 0,
    }));
  
    return [final.map((p) => this.formatProperty(p, baseUrl)), total];
  }

  async searchPropertyByTitle(title: string,baseUrl: string,page: number,items: number,userId: number) {
    const query = await this.buildPropertyQuery(userId);
    query.andWhere('post.title ILIKE :title', { title: `%${title}%` });

    const [rawResults, total] = await Promise.all([
      query.skip((page - 1) * items).take(items).getRawAndEntities(),
      query.getCount(),
    ]);
  
    const entities = rawResults.entities;
    const raw = rawResults.raw;
  
    const final = entities.map((entity, index) => ({
      ...entity,
      calculated_price: Number(raw[index]?.calculated_price),
      is_favorite: raw[index]?.is_favorite === true || raw[index]?.is_favorite === 'true' ? 1 : 0,
    }));
  
    return [final.map((p) => this.formatProperty(p, baseUrl)), total];
  }

  private formatProperty(property,baseUrl: string){
    
    const base = {
      propertyId:property.id,
      postTitle: property.post.title,
      postImage: `${baseUrl}/uploads/properties/posts/images/${property.post.image}`,
      location: `${property.region?.city?.name}, ${property.region?.name}`,
      postDate: property.post.date.toISOString().split('T')[0],
      is_favorite: property.is_favorite ? 1 : 0,
    }

    if (property.residential?.listing_type === ListingType.RENT) {
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
        price:property.calculated_price,
      };
    }   
  }

  private formatPropertyDetails(property: Property, baseUrl: string) {
  const base = {
    postTitle: property.post?.title,
    postDescription: property.post?.description,
    postImage: `${baseUrl}/uploads/properties/posts/images/${property.post.image}`,
    postDate: property.post.created_at.toISOString().split('T')[0],
    PostStatus: property.post.status,
    id: property.id,
    area: property.area,
    property_type: property.property_type,
    ownership_type: property.residential?.ownership_type ?? null,
    direction: property.residential?.direction ?? null,
    status: property.residential?.status ?? null,
    coordinates: {
      latitude: property.latitude,
      longitude: property.longitude,
    },
    floor_number: property.floor_number,
    notes: property.notes ?? null,
    highlighted: property.highlighted,
    room_counts: {
      total: property.room_count,
      bedroom: property.bedroom_count,
      living_room: property.living_room_count,
      kitchen: property.kitchen_count,
      bathroom: property.bathroom_count,
    },
    has_furniture: property.has_furniture,
    location: `${property.region?.city?.name}, ${property.region?.name}`,
    region: {
      id: property.region?.id,
      name: property.region?.name,
    },
    city: {
      id: property.region?.city?.id,
      name: property.region?.city?.name,
    },
    images: property.images.map(image => ({
      id: image.id,
      image_url: `${baseUrl}/uploads/properties/images/${image.image_path}`,
    })),
    tag: property.post?.tag,
  };

  if (property.residential?.listing_type === ListingType.RENT) {
    const rentalPeriod = property.residential?.rental_period ?? null;
    const baseMonthlyPrice = property.residential?.monthly_price ?? null;
    const adjustedMonthlyPrice = rentalPeriod == RentalPeriod.YEARLY && baseMonthlyPrice !== null
      ? baseMonthlyPrice * 12
      : baseMonthlyPrice;
    
    return {
      ...base,
      rate:property.rate ?? null,
      listing_type: 'أجار',
      rent_details: {
        price: adjustedMonthlyPrice,
        rental_period: rentalPeriod
      },
    };
  } else {
    return {
      ...base,
      listing_type: 'بيع',
      sell_details: {
        selling_price: property.residential?.selling_price ?? null,
        installment_allowed: property.residential?.installment_allowed ?? false,
        installment_duration: property.residential?.installment_duration ?? null,
      },
    };
  }
 }

 private async buildPropertyQuery(userId: number,filters?: PropertiesFiltersDto,){
      const query = this.propertyRepo.createQueryBuilder('property')
        .leftJoin('property.residential', 'residential')
        .leftJoin('property.post', 'post')
        .leftJoin('property.region', 'region')
        .leftJoin('region.city', 'city')
        .select([
          'property.id',
          'property.area',
          'property.region',
          'property.rate',
      
          'post.id',
          'post.title',
          'post.description',
          'post.tag',
          'post.image',
          'post.status',
          'post.date',
      
          'residential.listing_type',
          'residential.selling_price',
          'residential.monthly_price',
          'residential.rental_period',
      
          'region.id',
          'region.name',
      
          'city.id',
          'city.name',
        ])
        .addSelect(
          `CASE
             WHEN residential.listing_type = :rent AND residential.rental_period = :yearly THEN residential.monthly_price * 12
             WHEN residential.listing_type = :rent THEN residential.monthly_price
             ELSE residential.selling_price
           END`,
          'calculated_price'
        )
        .where('property.is_deleted = false')
        .andWhere('post.status = :status', { status: PropertyPostStatus.APPROVED })
        .setParameters({
          rent: ListingType.RENT,
          yearly: RentalPeriod.YEARLY,
        });

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

      
      if (filters) {
        if (filters.listing_type) {
          query.andWhere('residential.listing_type = :listing_type', {
            listing_type: filters.listing_type,
          });
        }
    
        if (filters.regionId) {
          query.andWhere('region.id = :regionId', { regionId: filters.regionId });
        }
    
        if (filters.tag) {
          query.andWhere('post.tag = :tag', { tag: filters.tag });
        }
      
        if (filters.orderByPrice) {
          query.orderBy('calculated_price',  'DESC');
        }
      
        if (filters.orderByArea) {
          query.addOrderBy('property.area', 'DESC');
        }
    
        if (filters.orderByDate) {
          query.addOrderBy('post.date', 'DESC');
        }
      }
  
    return query;
 }

 private createBasePropertyDetailsQuery(filters?: SearchPropertiesDto){
  const query = this.propertyRepo.createQueryBuilder('property')
    .leftJoin('property.office', 'office')
    .leftJoin('property.residential', 'residential')
    .leftJoin('property.images', 'images')
    .leftJoin('property.region', 'region')
    .leftJoin('region.city', 'city')
    .leftJoin('property.post', 'post')
    .where('property.is_deleted = false')
    .select([
    'property.id',
    'property.area',
    'property.latitude',
    'property.longitude',
    'property.property_type',
    'property.floor_number',
    'property.notes',
    'property.rate',
    'property.highlighted',
    'property.room_count',
    'property.bedroom_count',
    'property.living_room_count',
    'property.kitchen_count',
    'property.bathroom_count',
    'property.has_furniture',
    'property.rate',

    'post.id',
    'post.title',
    'post.image',
    'post.created_at',
    'post.status',
    'post.description',
    'post.tag',

    'residential.status',
    'residential.monthly_price',
    'residential.rental_period',
    'residential.listing_type',
    'residential.selling_price',
    'residential.installment_allowed',
    'residential.installment_duration',
    'residential.ownership_type',
    'residential.direction',

    'images.id',
    'images.image_path',

    'region.id',
    'region.name',

    'city.id',
    'city.name',
    ]);

  // Apply optional filters
  if (filters) {
    if (filters.listing_type) {
      query.andWhere('residential.listing_type = :listing_type', { listing_type: filters.listing_type });
    }

    if (filters.regionId) {
      query.andWhere('region.id = :regionId', { regionId: filters.regionId });
    }

    if (filters.cityId) {
      query.andWhere('city.id = :cityId', { cityId: filters.cityId });
    }

    if (filters.status) {
      query.andWhere('residential.status = :status', { status: filters.status });
    }

    if (filters.tag) {
      query.andWhere('post.tag = :tag', { tag: filters.tag });
    }
  }

  return query;
 }

 private buildUpdatePayload(data: UpdatePropertyDto): Partial<Property> {
  const payload: any = { ...data };

  if (data.room_details) {
    const {
      living_room_count,
      bedroom_count,
      bathroom_count,
      room_count,
      kitchen_count
    } = data.room_details;

    if (living_room_count !== undefined) payload.living_room_count = living_room_count;
    if (bedroom_count !== undefined) payload.bedroom_count = bedroom_count;
    if (bathroom_count !== undefined) payload.bathroom_count = bathroom_count;
    if (room_count !== undefined) payload.room_count = room_count;
    if (kitchen_count !== undefined) payload.kitchen_count = kitchen_count;

    delete payload.room_details; // remove nested object
  }

  return payload;
}

}