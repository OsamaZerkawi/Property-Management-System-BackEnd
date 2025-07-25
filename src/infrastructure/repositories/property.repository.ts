import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { max, min } from "class-validator";
import { ExploreMapDto } from "src/application/dtos/map/explore-map.dto";
import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import { SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { PropertyFeedback } from "src/domain/entities/property-feedback.entity";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { CombinedPropertyStatus } from "src/domain/enums/combined-property-status.enum";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";
import { TouristicStatus } from "src/domain/enums/touristic-status.enum";
import { PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { QueryRunnerAlreadyReleasedError, Repository } from "typeorm";
import { queryObjects } from "v8";
import { CityRegionSeeder } from "../database/seeders/city-region.seeder";

@Injectable()
export class PropertyRepository implements PropertyRepositoryInterface {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(PropertyFeedback)
    private readonly feedbackRepo: Repository<PropertyFeedback>,
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
    const query = await this.createBasePropertyDetailsQuery()
    .andWhere('property.id =:id',{id});

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
    else if (listingType == ListingType.RENT && residential.rental_price){
      price = residential.rental_price;
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
      query2.andWhere('residential.rental_price BETWEEN :min AND :max', {
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
      'residential.rental_price',
      'residential.rental_period',
  
      'region.id',
      'region.name',
  
      'city.id',
      'city.name',
    ])
    .addSelect(
      `CASE
         WHEN residential.listing_type = :rent THEN residential.rental_price
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
    .andWhere('property.property_type = :type', { type: PropertyType.RESIDENTIAL })
    .andWhere('office.user_id = :userId', { userId });
    
    const rawProperties = await query.getRawAndEntities();
    const properties = rawProperties.entities;
    const raw = rawProperties.raw;
  
    return properties.map((property, index) => {
      const avgRate = parseFloat(raw[index].avg_rate) || 0;
      return {
        ...this.formatPropertyDetails(property, baseUrl),
        rate: avgRate,
      };
    });
  }

  async findPropertyDetailsById(propertyId: number, baseUrl: string,userId: number) {
    const {property,rawData } = await this.createBasePropertyQuery(propertyId,userId);


    const formatted = this.formatPropertyDetails(property,baseUrl);
    
    return {
      ...formatted,
      avg_rate: parseFloat(rawData.avg_rate) || 0,
      rating_count: parseInt(rawData.rating_count) || 0,
      is_favorite: rawData.is_favorite ? 1 : 0,
      office: {
        id: property.office?.id,
        name: property.office?.name,
        logo: property.office?.logo
          ? `${baseUrl}/uploads/offices/logos/${property.office.logo}`
          : null,
        type: property.office?.type ?? null,
        rate:{
          avreg: parseFloat(rawData.office_average_rating || 0),
          count: parseInt(rawData.office_rating_count)
        },
      },
    };
  }

  async findPropertiesByUserOfficeWithFilters(userId: number, filters: SearchPropertiesDto,baseUrl: string) {
    const query =  await this.createBasePropertyDetailsQuery(filters)
    .andWhere('property.property_type = :type', { type: PropertyType.RESIDENTIAL })
    .andWhere('office.user_id = :userId', { userId });
    
    const rawProperties = await query.getRawAndEntities();
    const properties = rawProperties.entities;
    const raw = rawProperties.raw;
  
    return properties.map((property, index) => {
      const avgRate = parseFloat(raw[index].avg_rate) || 0;
      return {
        ...this.formatPropertyDetails(property, baseUrl),
        rate: avgRate,
      };
    });
  }

  async searchPropertiesForOfficeByTitle(userId: number,title: string,baseUrl: string) {
    const query =  await this.createBasePropertyDetailsQuery()
    .andWhere('property.property_type = :type', { type: PropertyType.RESIDENTIAL })
    .andWhere('office.user_id = :userId', { userId })
    .andWhere('post.title ILIKE :title', { title: `%${title}%` });
    
    const rawProperties = await query.getRawAndEntities();
    const properties = rawProperties.entities;
    const raw = rawProperties.raw;
  
    return properties.map((property, index) => {
      const avgRate = parseFloat(raw[index].avg_rate) || 0;
      return {
        ...this.formatPropertyDetails(property, baseUrl),
        rate: avgRate,
      };
    });
  }


  async findPropertyByPropertyIdAndUserOffice(userId: number,propertyId: number, baseUrl: string) {
    const query = await this.createBasePropertyDetailsQuery()
    .andWhere('property.property_type = :type', { type: PropertyType.RESIDENTIAL })
    .andWhere('office.user_id = :userId', { userId })
    .andWhere('property.id = :propertyId', { propertyId });

    const { entities, raw } = await query.getRawAndEntities();
  
    if (entities.length === 0) {
      throw new NotFoundException(
        errorResponse('لا يوجد عقار بهذا المعرف', 404)
      );
    }
  
    const property = entities[0];
    const avgRate = parseFloat(raw[0].avg_rate) || 0;
  
    const formatted = this.formatPropertyDetails(property, baseUrl);
  
    return {
      ...formatted,
      rate: avgRate,
    };    

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

  async compareTwoProperties(propertyId1: number, propertyId2: number,userId: number, baseUrl: string) {
    const {property,rawData } = await this.createBasePropertyQuery(propertyId1,userId);
    const { property: property2, rawData: rawData2 } = await this.createBasePropertyQuery(propertyId2, userId);

    if (!property || !property2) {
      throw new NotFoundException(
        errorResponse('لم يتم العثور على أحد العقارين أو كلاهما',404)
      );
    }
    const property1Data = {
      ...this.formatPropertyDetails(property,baseUrl),
      avg_rate: parseFloat(rawData.avg_rate) || 0,
      rating_count: parseInt(rawData.rating_count) || 0,
      is_favorite: rawData.is_favorite ? 1 : 0,
    }

    const property2Data = {
      ...this.formatPropertyDetails(property2,baseUrl),
      avg_rate: parseFloat(rawData2.avg_rate) || 0,
      rating_count: parseInt(rawData2.rating_count) || 0,
      is_favorite: rawData2.is_favorite ? 1 : 0,
    }
    return {
      property_1: property1Data,
      property_2: property2Data,
    }
  }

  async findWithinBounds(bounds: ExploreMapDto) {
    return this.propertyRepo.createQueryBuilder('property')
    .select(['property.id','property.latitude', 'property.longitude'])
    .where('property.latitude BETWEEN :minLat AND :maxLat', {
      minLat: bounds.minLat,
      maxLat: bounds.maxLat,
    })
    .andWhere('property.longitude BETWEEN :minLng AND :maxLng', {
      minLng: bounds.minLng,
      maxLng: bounds.maxLng,
    })
    .andWhere('property.is_deleted = false')
    .getMany();
  }

  private formatPropertyForComparison(property: Property,rawData: any,baseUrl: string){
    return {
      property_details: {
        id: property.id,
        area: property.area,
        property_type: property.property_type,
        ownership_type: property.residential?.ownership_type ?? null,
        direction: property.residential?.direction ?? null,
        status: property.residential?.status ?? null,
        floor_number: property.floor_number,
        has_furniture: property.has_furniture,
        highlighted: property.highlighted,
        notes: property.notes ?? null,
        listing_type: property.residential.listing_type,
        ...(property.residential?.listing_type === ListingType.RENT && {
          rent_period: property.residential?.rental_period,
        }),
        price: Number(rawData?.calculated_price),
      },
      room_details: {
        total: property.room_count,
        bedroom: property.bedroom_count,
        living_room: property.living_room_count,
        kitchen: property.kitchen_count,
        bathroom: property.bathroom_count,
      },
      location: {
        coordinates: {
          latitude: property.latitude,
          longitude: property.longitude,
        },
        city: property.region?.city
          ? {
              id: property.region.city.id,
              name: property.region.city.name,
            }
          : null,
        region: property.region
          ? {
              id: property.region.id,
              name: property.region.name,
            }
          : null,
        full_address: property.region?.city && property.region
          ? `${property.region.city.name}، ${property.region.name}`
          : null,
      },
      images: property.images?.map(img => ({
        id: img.id,
        image_url: `${baseUrl}/uploads/properties/images/${img.image_path}`,
      })) ?? [],
    };
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
      postStatus: property.post.status,
      propertyId: property.id,
      area: property.area,
      property_type: property.property_type,
      coordinates: {
        latitude: property.latitude,
        longitude: property.longitude,
      },
      floor_number: property.floor_number,
      notes: property.notes ?? null,
      highlighted: property.highlighted,
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
  
    if (property.property_type === PropertyType.RESIDENTIAL) {
      const res = property.residential;
  
      return {
        ...base,
        ownership_type: res?.ownership_type ?? null,
        direction: res?.direction ?? null,
        status: res?.status ?? null,
        room_counts: {
          total: property.room_count,
          bedroom: property.bedroom_count,
          living_room: property.living_room_count,
          kitchen: property.kitchen_count,
          bathroom: property.bathroom_count,
        },
        // rate: property.rate ?? null,
        listing_type: res?.listing_type === ListingType.RENT ? 'أجار' : 'بيع',
        ...(res?.listing_type === ListingType.RENT
          ? {
              rent_details: {
                price: res.rental_price ?? null,
                rental_period: res.rental_period ?? null,
              },
            }
          : {
              sell_details: {
                selling_price: res.selling_price ?? null,
                installment_allowed: res.installment_allowed ?? false,
                installment_duration: res.installment_duration ?? null,
              },
            }),
      };
    }
  
    if (property.property_type === PropertyType.TOURISTIC) {
      const tour = property.touristic;
  
      return {
        ...base,
        rate: property.rate ?? null,
        price: tour?.price,
        status: tour?.status,
        touristic_info: {
          street: tour?.street,
          electricity: tour?.electricity,
          water: tour?.water,
          pool: tour?.pool,
        },
        services: tour?.additionalServices?.map(s => s.service.name) ?? [],
      };
    }
  
    // Add fallback if needed for other types
    return base;
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
          'residential.rental_price',
          'residential.rental_period',
      
          'region.id',
          'region.name',
      
          'city.id',
          'city.name',
        ])
        .addSelect(
          `CASE
             WHEN residential.listing_type = :rent THEN residential.rental_price
             ELSE residential.selling_price
           END`,
          'calculated_price'
        )
        .where('property.is_deleted = false')
        .andWhere('post.status = :status', { status: PropertyPostStatus.APPROVED })
        .andWhere('residential.status = :resStatus',{resStatus: PropertyStatus.AVAILABLE})
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

      if(filters.cityId){
        query.andWhere('city.id = :cityId',{cityId: filters.cityId});
      }
  
      if (filters.tag) {
        query.andWhere('post.tag = :tag', { tag: filters.tag });
      }
    
      if (filters.orderByPrice) {
        query.orderBy('calculated_price',  filters.orderByPrice);
      }
    
      if (filters.orderByArea) {
        query.addOrderBy('property.area', filters.orderByArea);
      }
  
      if (filters.orderByDate) {
        query.addOrderBy('post.date', filters.orderByDate);
      }
    }
  
    return query;
 }

 async getTopRatedProperties(page: number,items: number,type: PropertyType,userId: number) {
  const offset = (page - 1) * items;

  const baseQuery = this.propertyRepo
    .createQueryBuilder('property')
    .leftJoin('property.post', 'post')
    .leftJoin('property.region', 'region')
    .leftJoin('region.city', 'city')
    .leftJoin('property.feedbacks', 'feedback')
    .where('property.property_type = :type', { type })
    .andWhere('property.is_deleted = false')
    .andWhere('post.status = :status', { status: PropertyPostStatus.APPROVED });

  if (type === PropertyType.RESIDENTIAL) {
    baseQuery
      .leftJoin('property.residential', 'residential')
      .andWhere('residential.listing_type = :listingType', {
        listingType: ListingType.RENT,
      })
      .andWhere('residential.status = :resStatus',{resStatus: PropertyStatus.AVAILABLE})
      .select([
        'property.id AS property_id',
        'post.title AS post_title',
        'post.image AS post_image',
        'city.name AS city_name',
        'region.name AS region_name',
        'residential.listing_type AS listing_type',
        // 'residential.selling_price AS selling_price',
        'residential.rental_price AS rental_price',
        'residential.rental_period AS rental_period',
        'COALESCE(AVG(feedback.rate), 0) AS avg_rate',
        'COUNT(DISTINCT feedback.user_id) AS rating_count',
        'COUNT(*) OVER() AS total_count',
      ])
      .groupBy('property.id')
      .addGroupBy('post.title')
      .addGroupBy('post.image')
      .addGroupBy('city.name')
      .addGroupBy('region.name')
      .addGroupBy('residential.listing_type')
      // .addGroupBy('residential.selling_price')
      .addGroupBy('residential.rental_price')
      .addGroupBy('residential.rental_period');
  } else if (type === PropertyType.TOURISTIC) {
    baseQuery
      .leftJoin('property.touristic', 'touristic')
      .andWhere('touristic.status = :touristicStatus',{touristicStatus: TouristicStatus.AVAILABLE})
      .select([
        'property.id AS property_id',
        'post.title AS post_title',
        'post.image AS post_image',
        'city.name AS city_name',
        'region.name AS region_name',
        'touristic.price AS touristic_price',
        'COALESCE(AVG(feedback.rate), 0) AS avg_rate',
        'COUNT(DISTINCT feedback.user_id) AS rating_count',
        'COUNT(*) OVER() AS total_count',
      ])
      .groupBy('property.id')
      .addGroupBy('post.title')
      .addGroupBy('post.image')
      .addGroupBy('city.name')
      .addGroupBy('region.name')
      .addGroupBy('touristic.price')
      .addGroupBy('touristic.status');
  } 

    baseQuery.orderBy('avg_rate', 'DESC')
    .offset(offset)
    .limit(items)

  if (userId) {
    baseQuery.addSelect(`
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM property_favorites pf 
          WHERE pf.property_id = property.id AND pf.user_id = :userId
        ) THEN true
        ELSE false
      END
    `, 'is_favorite')
    .setParameter('userId', userId);
  } else {
    baseQuery.addSelect('false', 'is_favorite');
  }

  const raw = await baseQuery.getRawMany();

  const total = raw[0]?.total_count ? parseInt(raw[0].total_count, 10) : 0;

  return { raw, total };
 }

  private async createBasePropertyQuery(propertyId: number,userId: number) {
    const query = await this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.images', 'images')
      .leftJoinAndSelect('property.region', 'region')
      .leftJoinAndSelect('region.city', 'city')
      .leftJoinAndSelect('property.post', 'post')
      .leftJoin('property.feedbacks', 'feedback')
      .leftJoinAndSelect('property.office', 'office')
  
      // Join both residential and touristic (only one will have data)
      .leftJoinAndSelect('property.residential', 'residential')
      .leftJoinAndSelect('property.touristic', 'touristic')
      .leftJoinAndSelect('touristic.additionalServices', 'additionalServices')
      .leftJoinAndSelect('additionalServices.service', 'service')
  
      .where('property.id = :propertyId', { propertyId })
      .andWhere('property.is_deleted = false')
  
      .select([
        // Main property fields
        'property.id',
        'property.property_type',
        'property.area',
        'property.latitude',
        'property.longitude',
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

        //feedback rating
        'COALESCE(AVG(feedback.rate), 0) AS avg_rate',
        'COUNT(DISTINCT feedback.user_id) AS rating_count',
  
        // Images
        'images.id',
        'images.image_path',
  
        // Post
        'post.id',
        'post.title',
        'post.image',
        'post.description',
        'post.tag',
        'post.status',
        'post.created_at',
  
        // Region & City
        'region.id',
        'region.name',
        'city.id',
        'city.name',
  
        // Office (if needed)
        'office.id',
        'office.name',
  
        // Residential fields
        'residential.id',
        'residential.status',
        'residential.rental_price',
        'residential.rental_period',
        'residential.listing_type',
        'residential.selling_price',
        'residential.installment_allowed',
        'residential.installment_duration',
        'residential.ownership_type',
        'residential.direction',
  
        // Touristic fields
        'touristic.id',
        'touristic.price',
        'touristic.status',
        'touristic.pool',
        'touristic.street',
        'touristic.electricity',
        'touristic.water',

        
        // Services
        'additionalServices.serviceId',
        'additionalServices.touristicId',
        'service.id',
        'service.name',
      ])

      query.leftJoin('office.feedbacks', 'office_feedbacks');

      query.addSelect([
        'office.id',
        'office.name',
        'office.logo',
        'office.type',
        'office_feedbacks.id',
        'office_feedbacks.rate',
      ]);

      query.addSelect(
        `(SELECT COALESCE(AVG(of.rate), 0) FROM office_feedbacks of WHERE of.office_id = office.id)`,
        'office_average_rating'
      );

      query.addSelect(
        `(SELECT COUNT(of.id) FROM office_feedbacks of WHERE of.office_id = office.id AND of.rate IS NOT NULL)`,
        'office_rating_count'
      );

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

    query.groupBy(`
      property.id,
      images.id,
      post.id,
      region.id,
      city.id,
      office.id,
      residential.id,
      touristic.id,
      office.id,
      office_feedbacks.id,
      additionalServices.serviceId,
      additionalServices.touristicId,
      service.id
    `);

    const { entities, raw } = await query.getRawAndEntities();
    const property = entities[0];
    const rawData = raw[0];

    if(!property){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار بهذا المعرف ',404)
      );  
    }

    return { property, rawData};

  }

  private createBasePropertyDetailsQuery(filters?: SearchPropertiesDto) {
    const query = this.propertyRepo.createQueryBuilder('property')
      .leftJoin('property.office', 'office')
      .leftJoin('property.residential', 'residential')
      .leftJoin('property.images', 'images')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.post', 'post')
      .leftJoin('property.feedbacks', 'feedback')
      .where('property.is_deleted = false')
      .select([
        'property.id',
        'property.area',
        'property.latitude',
        'property.longitude',
        'property.property_type',
        'property.floor_number',
        'property.notes',
        'property.highlighted',
        'property.room_count',
        'property.bedroom_count',
        'property.living_room_count',
        'property.kitchen_count',
        'property.bathroom_count',
        'property.has_furniture',
  
        'post.id',
        'post.title',
        'post.image',
        'post.created_at',
        'post.status',
        'post.description',
        'post.tag',
  
        'residential.status',
        'residential.rental_price',
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
      ])
      .addSelect('COALESCE(AVG(feedback.rate), 0)', 'avg_rate')
      .addSelect('COUNT(feedback.id)', 'feedback_count')
      .groupBy('property.id')
      .addGroupBy('post.id')
      .addGroupBy('residential.id')
      .addGroupBy('images.id')
      .addGroupBy('region.id')
      .addGroupBy('city.id')
      .addGroupBy('office.id');
  
    // Apply optional filters 
    if (filters) {
      const postStatuses = [
        CombinedPropertyStatus.PENDING,
        CombinedPropertyStatus.REJECTED,      
      ];
  
      if(filters.status){
        if(postStatuses.includes(filters.status)){
          query.andWhere('post.status = :postStatus', {
            postStatus: filters.status,
          });
        } else{
          query.andWhere('post.status = :approvedStatus', {
            approvedStatus: PropertyPostStatus.APPROVED,
          });
          query.andWhere('residential.status = :resStatus', {
            resStatus: filters.status,
          });
        }
      }
      if (filters.listing_type) {
        query.andWhere('residential.listing_type = :listing_type', { listing_type: filters.listing_type });
      }
  
      if (filters.regionId) {
        query.andWhere('region.id = :regionId', { regionId: filters.regionId });
      }
  
      if (filters.cityId) {
        query.andWhere('city.id = :cityId', { cityId: filters.cityId });
      }
  
      if (filters.tag) {
        query.andWhere('post.tag = :tag', { tag: filters.tag });
      }
    }
  
    return query;
  }

 async rateProperty(userId: number, propertyId: number, rate: number) {
    const property = await this.propertyRepo.findOne({where:{id:propertyId},relations: ['residential']});
    const user = await this.userRepo.findById(userId);

    if(!property){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار لهذا المعرف',404)
      );
    }

    if(property.residential.listing_type === ListingType.SALE){
      throw new ForbiddenException(
        errorResponse ('لا يمكنك تقييم عقار للشراء',403)
      );
    }

    let feedback = await this.feedbackRepo.findOne({
      where: { user : { id: userId},property: {id : property.id}}
    });

    if(!feedback){
      feedback = this.feedbackRepo.create({
        property,
        user,
        rate
      });
    }else {
      feedback.rate = rate;
    }

    return this.feedbackRepo.save(feedback);
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
  async findOneByIdAndOffice(propertyId: number, officeId: number): Promise<Property | null> {
    return this.propertyRepo.createQueryBuilder('property')
      .innerJoin('property.office', 'office')
      .where('property.id = :propertyId', { propertyId })
      .andWhere('office.id = :officeId', { officeId })
      .getOne();
  }

}