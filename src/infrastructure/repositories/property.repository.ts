import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { Property } from "src/domain/entities/property.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
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
    
    await this.propertyRepo.save(property);
    return property;
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
    const properties = await this.buildPropertyQuery(userId).getMany();

    return properties.map(property => this.formatPropertyDetails(property, baseUrl));
  }

  async findPropertiesByUserOfficeWithFilters(userId: number, filters: SearchPropertiesDto,baseUrl: string) {
    const properties = await this.buildPropertyQuery(userId,filters).getMany();
    
    return properties.map(property => this.formatPropertyDetails(property, baseUrl));
  }

  async searchPropertiesByTitle(userId: number,title: string,baseUrl: string) {
      const properties = await this.buildPropertyQuery(userId)
      .where('post.title ILIKE :title', { title: `%${title}%` })
      .getMany();

      return properties.map(property => this.formatPropertyDetails(property,baseUrl));
  }


  async findPropertyByPropertyIdAndUserOffice(userId: number,propertyId: number, baseUrl: string) {
    const property = await this.buildPropertyQuery(userId)
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

  private formatPropertyDetails(property: Property, baseUrl: string) {
  const base = {
    id: property.id,
    area: property.area,
    property_type: property.property_type,
    ownership_type: property.residential?.ownership_type ?? null,
    direction: property.residential?.direction ?? null,
    status: property.residential?.status ?? null,
    location: {
      latitude: property.latitude,
      longitude: property.longitude,
    },
    floor_number: property.floor_number,
    notes: property.notes ?? null,
    rate: property.rate,
    highlighted: property.highlighted,
    room_counts: {
      total: property.room_count,
      bedroom: property.bedroom_count,
      living_room: property.living_room_count,
      kitchen: property.kitchen_count,
      bathroom: property.bathroom_count,
    },
    has_furniture: property.has_furniture,
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
    tags: property.post?.propertyPostTags?.map(ppt => ({
      id: ppt.tag?.id,
      name: ppt.tag?.name,
    })),
  };

  if (property.residential?.listing_type === ListingType.RENT) {
    return {
      ...base,
      listing_type: 'أجار',
      rent_details: {
        monthly_price: property.residential?.monthly_price ?? null,
        rental_period: property.residential?.rental_period ?? null,
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

 private buildPropertyQuery(userId: number,filters?: SearchPropertiesDto){
  const query = this.propertyRepo.createQueryBuilder('property')
    .leftJoin('property.office', 'office')
    .leftJoin('property.residential', 'residential')
    .leftJoin('property.images', 'images')
    .leftJoin('property.region', 'region')
    .leftJoin('region.city', 'city')
    .leftJoin('property.post', 'propertyPost')
    .leftJoin('propertyPost.propertyPostTags', 'propertyPostTag')
    .leftJoin('propertyPostTag.tag', 'tag')
    .where('office.user_id = :userId', { userId })
    .andWhere('property.is_deleted = false')
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

    'propertyPost.id',
    'propertyPostTag.id', 
    'tag.id',
    'tag.name',
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

    if (filters.tagIds?.length) {
      query.andWhere('tag.id IN (:...tagIds)', { tagIds: filters.tagIds });
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