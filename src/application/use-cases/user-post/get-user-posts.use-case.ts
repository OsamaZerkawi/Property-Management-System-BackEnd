import { Inject } from "@nestjs/common";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";

export class GetUserPostsUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface,
    ){}

    async execute(){
        return await this.userPostRepo.getAll();
    }
}