import { InjectRepository } from "@nestjs/typeorm";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostAdminAgreement } from "src/domain/enums/user-post-admin-agreement.enum";
import { UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { FindOptionsOrderValue, Repository } from "typeorm";

export class UserPostRepository implements UserPostRepositoryInterface {
    constructor(
      @InjectRepository(UserPost)
      private readonly userPostRepo: Repository<UserPost>,
    ) {}

    async findById(id: number) {
      return await this.userPostRepo.findOne({where:{id}});
    }

    async findByIdAndUser(id: number, userId: number) {
      return this.userPostRepo.findOne({
        where: {
          id,
          user: { id: userId }, 
        },
      });
    }

    async deleteById(id: number) {
      return this.userPostRepo.delete(id);
    }
    async getAll(officeId: number) {
      return this.fetchPosts(officeId);
    }

    async getWithFilters(officeId: number,data: UserPostFiltersDto) {
      return await this.fetchPosts(officeId,data);
    }  

    async getAllByUser(userId: number) {
      const posts = await this.userPostRepo.find(
        this.buildFindOptions({ user: { id: userId } })
      );
      return this.transformUserPostList(posts);
    }
    
    async getAllByUserWithStatus(userId: number, status: UserPostAdminAgreement) {
      const posts = await this.userPostRepo.find(
        this.buildFindOptions({ user: { id: userId }, status })
      );
      return this.transformUserPostList(posts);
    }

    private buildFindOptions(where: object){
      return {
        where,
        relations: ['region', 'region.city'],
        order: { created_at: 'DESC' as FindOptionsOrderValue },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          budget: true,
          created_at: true,
          status: true,
        },
      };
    }

    async findSuggestionsByUserPostId(id: number,userId: number) {
      return this.userPostRepo
        .createQueryBuilder('user_post')
        .leftJoin('user_post.userPostSuggestions', 'suggestion')
        .leftJoin('suggestion.property', 'property')
        .leftJoin('property.post', 'post')
        .leftJoin('property.region', 'region')
        .leftJoin('region.city', 'city')
        .leftJoin('property.residential', 'residential')
        .leftJoin('property.feedbacks', 'feedback')
        .where('user_post.id = :id', { id })
        .where('user_post.user_id = :userId', { userId })
        .andWhere('property.is_deleted = false')
        .select([
          'property.id AS property_id',
          'post.title AS post_title',
          'post.image AS post_image',
          'city.name AS city_name',
          'region.name AS region_name',
          'residential.listing_type AS listing_type',
          'residential.selling_price AS selling_price',
          'residential.rental_price AS rental_price',
          'AVG(feedback.rate) AS avg_rate'
        ])
        .groupBy('property.id, post.title, post.image, city.name, region.name, residential.listing_type, residential.selling_price, residential.rental_price')
        .getRawMany();
    }

    private transformUserPostList(posts: any[]) {
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        type: post.type,
        location: `${post.region.city.name}, ${post.region.name}`,
        budget: parseFloat(post.budget as any),
        createdAt: post.created_at.toISOString().split('T')[0],
        status: post.status,
      }));
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