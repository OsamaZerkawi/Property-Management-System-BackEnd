import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";

export const USER_POST_REPOSITORY = 'USER_POST_REPOSITORY';

export interface UserPostRepositoryInterface {
    findById(id: number);
    getAll(officeId: number);
    getWithFilters(officeId: number,data: UserPostFiltersDto);
}