import { UserPostFiltersDto } from 'src/application/dtos/user-post/user-post-filters.dto';
import { UserPostAdminAgreement } from '../enums/user-post-admin-agreement.enum';
import { UserPost } from '../entities/user-post.entity';

export const USER_POST_REPOSITORY = 'USER_POST_REPOSITORY';

export interface UserPostRepositoryInterface {
  findById(id: number);
  findByIdAndUser(id: number, userId: number);
  findSuggestionsByUserPostId(id: number,page: number,items: number, userId: number);
  deleteById(id: number);
  getAll(officeId: number);
  getWithFilters(officeId: number, data: UserPostFiltersDto);
  getAllByUser(userId: number);
  getAllByUserWithStatus(userId: number, status: UserPostAdminAgreement);
  create(userPost: Partial<UserPost>);
  getPostsByStatus(status: UserPostAdminAgreement);
  update(id: number,fields: Partial<UserPost>);
}
