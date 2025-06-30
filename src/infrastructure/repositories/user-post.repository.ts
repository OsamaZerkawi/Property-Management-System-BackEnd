import { InjectRepository } from "@nestjs/typeorm";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostAdminAgreement } from "src/domain/enums/user-post-admin-agreement.enum";
import { UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { Repository } from "typeorm";

export class UserPostRepository implements UserPostRepositoryInterface {
    constructor(
      @InjectRepository(UserPost)
      private readonly userPostRepo: Repository<UserPost>,
    ) {}

    async findById(id: number) {
      return await this.userPostRepo.findOne({where:{id}});
    }

    async getAll(officeId: number) {
      return this.fetchPosts(officeId);
    }

    async getWithFilters(officeId: number,data: UserPostFiltersDto) {
      return await this.fetchPosts(officeId,data);
    }  

    private async fetchPosts(officeId: number,filters?: UserPostFiltersDto) {
      const query = this.userPostRepo
        .createQueryBuilder('userPost')
        .innerJoin('userPost.region', 'region')
        .innerJoin('region.city', 'city')
        .select([
          'userPost.id AS id',
          'userPost.title AS title',
          'userPost.description AS description',
          'userPost.type AS type',
          'userPost.budget AS budget',
          'userPost.created_at AS "createdAt"',
          'region.name',
          'city.name ',
          `CONCAT(city.name, ', ', region.name) AS location`,
          `
          EXISTS (
            SELECT 1
            FROM user_post_suggestions ups
            INNER JOIN properties p ON p.id = ups.property_id
            WHERE ups.user_post_id = "userPost".id
            AND p.office_id = :officeId
          ) AS "isProposed"
          `
        ])
        .where('userPost.status = :status', {
          status: UserPostAdminAgreement.ACCEPTED,
        })
        .andWhere(
          `city.id = (
            SELECT c.id
            FROM offices o
            INNER JOIN regions r ON r.id = o.region_id
            INNER JOIN cities c ON c.id = r.city_id
            WHERE o.id = :officeId
          )`
        )
        .setParameter('officeId', officeId)
        .orderBy('userPost.created_at', 'DESC');
    
      // Optional Filters
      if (filters?.regionId) {
        query.andWhere('region.id = :regionId', { regionId: filters.regionId });
      }
    
      if (filters?.type) {
        query.andWhere('userPost.type = :type', { type: filters.type });
      }
    
      const rows = await query.getRawMany();
    
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        budget: Number(row.budget),
        publishedDate: new Date(row.createdAt).toLocaleDateString('en-CA'),
        location: row.location,
        isProposed: Number(row.isProposed === true || row.isProposed === '1'),
      }));
    }
}