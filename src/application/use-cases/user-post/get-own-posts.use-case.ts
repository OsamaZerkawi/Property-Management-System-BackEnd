import { Inject } from "@nestjs/common";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";

export class GetOwnPostsUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)   
        private readonly userPostRepo: UserPostRepositoryInterface,
    ){}

    async execute(userId: number){
        return await this.userPostRepo.getAllByUser(userId);
    }
}
