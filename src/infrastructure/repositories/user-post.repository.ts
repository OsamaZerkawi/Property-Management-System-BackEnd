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

    async getAll() {
        return this.fetchPosts();
    }

    async getWithFilters(data: UserPostFiltersDto) {
        return await this.fetchPosts(data);
    }  

    private async fetchPosts(filters?: UserPostFiltersDto) {
      const query = this.userPostRepo
        .createQueryBuilder('userPost')
        .leftJoinAndSelect('userPost.region', 'region')
        .leftJoinAndSelect('region.city', 'city')
        .select([
          'userPost.id',
          'userPost.title',
          'userPost.description',
          'userPost.type',
          'userPost.budget',
          'userPost.status',
          'userPost.created_at',
          'region.id',
          'region.name',
          'city.id',
          'city.name',
        ])
        .where('userPost.status = :status',{status: UserPostAdminAgreement.ACCEPTED})
        .orderBy('userPost.created_at', 'DESC');

        console.log('Filtering by status:', UserPostAdminAgreement.ACCEPTED);
    
      if (filters?.regionId) {
        query.andWhere('region.id = :regionId', { regionId: filters.regionId });
      }
    
      if (filters?.type) {
        query.andWhere('userPost.type = :type', { type: filters.type });
      }
    
      const userPosts = await query.getMany();
    
      return userPosts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        type: post.type,
        budget: post.budget,
        publishedDate: post.created_at.toISOString().split('T')[0],
        region: post.region?.name || null,
        city: post.region?.city?.name || null,
      }));
    }
}