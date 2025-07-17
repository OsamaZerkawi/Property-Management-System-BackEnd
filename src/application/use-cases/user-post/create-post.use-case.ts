import { Inject, Injectable } from "@nestjs/common";
import { CreateUserPostDto } from "src/application/dtos/user-post/create-post.dto";
import { UserPostAdminAgreement } from "src/domain/enums/user-post-admin-agreement.enum";
import { REGION_REPOSITORY, RegionRepositoryInterface } from "src/domain/repositories/region.repository";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { FindRegionUseCase } from "../region/find-region-by-id.use-case";

@Injectable()
export class CreateUserPostUseCase {
    constructor(
        private readonly findRegionUseCase: FindRegionUseCase,
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface,
    ){}

    async execute(userId: number,data: CreateUserPostDto){
        const region = await this.findRegionUseCase.execute(data.region_id);

        const newPost = await this.userPostRepo.create({
            user: {id: userId} as any,
            region,
            title: data.title,
            budget: data.budget,
            type:data.type,
            description: data.description,
            status: UserPostAdminAgreement.PINDING
        });

        return newPost;
    }
}