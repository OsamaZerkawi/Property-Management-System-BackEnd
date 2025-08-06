import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyFavorite } from "src/domain/entities/property-favorite.entity";
import { Property } from "src/domain/entities/property.entity";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { PropertyFavoriteRepositoryInterface } from "src/domain/repositories/property-favorite.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class PropertyFavoriteRepository implements PropertyFavoriteRepositoryInterface {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(PropertyFavorite)
    private readonly propertyFavoriteRepo: Repository<PropertyFavorite>,
  ){}
  
  async addPropertyToFavorite(id: number, userId: number) {
    const existing = await this.propertyFavoriteRepo
      .createQueryBuilder('favorite')
      .leftJoin('favorite.property', 'property')
      .where('property.id = :id', { id })
      .andWhere('favorite.user.id = :userId', { userId })
      .getOne();

    if(existing){
      throw new BadRequestException(
        errorResponse('العقار موجود بالفعل في المفضلة', 400)
      );
    }

    const property = await this.propertyRepo.findOne({
      where: {id}
    });

    if(!property){
      throw new NotFoundException(
        errorResponse('العقار غير موجود', 404)
      )
    }

    const favorite = this.propertyFavoriteRepo.create({
        user: {id: userId},
        property: {id},
    });
    await this.propertyFavoriteRepo.save(favorite);
  }

  async removePropertyFromFavorite(id: number, userId: number) {
    const favorite = await this.propertyFavoriteRepo.findOne({
        where: { 
            user: { id: userId},
            property: {id}
        }
    });
    if(!favorite){
        throw new NotFoundException(
            errorResponse('لا يوجد هذا العقار في المفضلة ',404)
        );
    }
    await this.propertyFavoriteRepo.delete(favorite.id);
  }

  async getFavoriteProperties(userId: number,type: PropertyType, page: number, items: number) {
    const offset = (page - 1) * items;

    const query = this.propertyFavoriteRepo
      .createQueryBuilder('fav')
      .innerJoin('fav.property', 'property')
      .innerJoin('property.region', 'region')
      .innerJoin('property.feedbacks', 'feedbacks')
      .innerJoin('region.city', 'city')
      .leftJoin('property.post', 'post')
      .where('fav.user_id = :userId', { userId })
      .andWhere('property.is_deleted = false')
      .andWhere('post.status = :status', { status: PropertyPostStatus.APPROVED });

    if (type === PropertyType.RESIDENTIAL) {
      query.leftJoin('property.residential', 'residential')
           .andWhere('residential.id IS NOT NULL')
           .select([
             'property.id AS property_id',
             'property.area AS area',
             'post.image AS image',
             'post.title AS title',
             'city.name AS city',
             'region.name AS region',
             'AVG(feedbacks.rate) AS avg_rate',
             `COALESCE(
                CASE
                  WHEN residential.id IS NOT NULL AND residential.listing_type = 'أجار' THEN residential.rental_price
                  WHEN residential.id IS NOT NULL THEN residential.selling_price
                  ELSE 0
                END, 0
              ) AS price`,
             'residential.listing_type AS listing_type',
             `COUNT(*) OVER() AS total_count`
           ])
           .groupBy('property.id')
           .addGroupBy('post.id')
           .addGroupBy('city.name')
           .addGroupBy('region.name')
           .addGroupBy('residential.id')
           .addGroupBy('fav.id');
    } else if (type === PropertyType.TOURISTIC) {
      query.leftJoin('property.touristic', 'touristic')
           .andWhere('touristic.id IS NOT NULL')
           .select([
             'fav.created_at',
             'property.id AS property_id',
             'property.area AS area',
             'post.image AS image',
             'post.title AS title',
             'city.name AS city',
             'region.name AS region',
             'AVG(feedbacks.rate) AS avg_rate',
             'touristic.price AS price',
             `'أجار' AS listing_type`,
             `COUNT(*) OVER() AS total_count`
           ])
            .groupBy('property.id')
           .addGroupBy('post.id')
           .addGroupBy('city.name')
           .addGroupBy('region.name')
           .addGroupBy('touristic.id')
           .addGroupBy('fav.id');
    }
    const rawResults = await query
      .orderBy('fav.created_at','DESC')

      .offset(offset)
      .limit(items)
      .getRawMany();

    const total = rawResults.length > 0 ? +rawResults[0].total_count : 0;
    
    const data = rawResults.map(({ total_count, ...rest }) => rest);
    
    return { data, total };
  }
}