import { Inject } from "@nestjs/common";
import { UserPostAdminAgreement } from "src/domain/enums/user-post-admin-agreement.enum";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";

export class GetOwnPostsWithStatusUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface,
    ){}

    async execute(uesrId: number, status: UserPostAdminAgreement){
        return await this.userPostRepo.getAllByUserWithStatus(uesrId,status);
    }
}