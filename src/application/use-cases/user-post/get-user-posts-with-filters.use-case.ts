import { Inject } from "@nestjs/common";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";

export class GetUserPostsWithFiltersUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface,
    ){}

    async execute(data: UserPostFiltersDto){
        return await this.userPostRepo.getWithFilters(data);
    }
}