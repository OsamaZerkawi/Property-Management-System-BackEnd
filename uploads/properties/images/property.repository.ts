import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import {  SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { Property } from "src/domain/entities/property.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { Repository } from "typeorm";

@Injectable()
export class PropertyRepository implements PropertyRepositoryInterface {
    constructor(
        @InjectRepository(Property)
        private readonly propertyRepo: Repository<Property>,
    ){}

    findByIdWithOwner(propertyId: number) {
        return this.propertyRepo.findOne({
            where: {
                id: propertyId
            },
            relations: {office: {user: true}},
        });
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

    async findPropertiesByUserOffice(userId: number,baseUrl: string) {
        const properties = await this.propertyRepo
        .createQueryBuilder('property')
        .leftJoinAndSelect('property.office', 'office')
        .leftJoinAndSelect('property.residential', 'residential')
        .leftJoinAndSelect('property.images', 'images')
        .leftJoinAndSelect('property.region', 'region')
        .leftJoinAndSelect('region.city', 'city')
        .where('office.user_id = :userId', { userId })
        .andWhere('property.is_deleted = false')
        .select([
          'property.id',
          'property.area',
          'property.latitude',
          'property.longitude',
          'property.property_type',
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
        ])
        .getMany();

        return properties.map(property => this.formatProperty(property, baseUrl));
    }

    async findPropertiesByUserOfficeWithFilters(userId: number, filters: SearchPropertiesDto,baseUrl: string) {
      const query = this.propertyRepo.createQueryBuilder('property')
      .leftJoinAndSelect('property.office', 'office')
      .leftJoinAndSelect('property.residential', 'residential')
      .leftJoinAndSelect('property.images', 'images')
      .leftJoinAndSelect('property.region', 'region')
      .leftJoinAndSelect('region.city', 'city')
      .where('office.user_id = :userId', { userId })
      .andWhere('property.is_deleted = false');
  
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
    
      const properties = await query
        .select([
          'property.id',
          'property.area',
          'property.latitude',
          'property.longitude',
          'property.property_type',
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
        ])
        .getMany();
  
        return properties.map(property => this.formatProperty(property, baseUrl));
    }

    private formatProperty(property: Property, baseUrl: string) {
    const base = {
      id: property.id,
      area: property.area,
      property_type: property.property_type,
      location: {
        latitude: property.latitude,
        longitude: property.longitude,
      },
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
        image_url: `${baseUrl}/uploads/${image.image_path}`,
      })),
      ownership_type: property.residential?.ownership_type ?? null,
      direction: property.residential?.direction ?? null,
      status: property.residential?.status ?? null,
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
}