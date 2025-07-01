import { Inject, NotFoundException } from "@nestjs/common";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class DeleteUserPostUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface,
    ){}

    async execute(userId: number,postId: number){
        const post = await this.userPostRepo.findByIdAndUser(postId,userId);

        if(!post){
            throw new NotFoundException(
                errorResponse('المنشور غير موجود',404)
            );
        }

        await this.userPostRepo.deleteById(postId);
    }
}