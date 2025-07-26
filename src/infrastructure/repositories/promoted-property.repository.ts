import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PromotedProperty } from "src/domain/entities/promoted-property.entity";
import { Property } from "src/domain/entities/property.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { PromotedPropertyRepositoryInterface } from "src/domain/repositories/promoted-property.repository";
import { Repository } from "typeorm";

export class PromotedPropertyRepository implements PromotedPropertyRepositoryInterface {
    
    constructor(
        @InjectRepository(PromotedProperty)
        private readonly promotedProeprtyRepo: Repository<PromotedProperty>,
        @InjectRepository(Property)
        private readonly propertyRepo: Repository<Property>,
    ){}

    async getAllPromotedProperties(page: number,items: number,userId: number) {
        const offset = (page - 1) * items;
    
        const baseQuery = this.propertyRepo
          .createQueryBuilder('property')
          .innerJoin('property.promoted','promoted')
          .leftJoin('property.post', 'post')
          .leftJoin('property.region', 'region')
          .leftJoin('region.city', 'city')
          .leftJoin('property.feedbacks', 'feedback')
          .where('property.property_type = :type', { type: PropertyType.RESIDENTIAL })
          .andWhere('property.is_deleted = false')
          .andWhere('post.status = :status', { status: PropertyPostStatus.APPROVED })
          .leftJoin('property.residential', 'residential')
          .andWhere('residential.status = :resStatus',{resStatus: PropertyStatus.AVAILABLE})
          .andWhere(`promoted.start_date <= CURRENT_DATE`)
          .andWhere(`(promoted.start_date + (promoted.period || ' days')::interval) >= CURRENT_DATE`)
          .select([
            'property.id AS property_id',
            'post.id',
            'post.title AS post_title',
            'post.image AS post_image',
            'post.created_at AS post_date',
            'city.name AS city_name',
            'region.name AS region_name',
            'residential.id',
            'residential.listing_type AS listing_type',
            'residential.selling_price AS selling_price',
            'residential.rental_price AS rental_price',
            'residential.rental_period AS rental_period',
            'COALESCE(AVG(feedback.rate), 0) AS avg_rate',
            'COUNT(DISTINCT feedback.user_id) AS rating_count',
            'COUNT(*) OVER() AS total_count',
          ])
          .groupBy('property.id')
          .addGroupBy('post.id')
          .addGroupBy('city.name')
          .addGroupBy('region.name')
          .addGroupBy('residential.id')
          .offset(offset)
          .limit(items);
    
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
}
