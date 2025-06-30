import { Inject, NotFoundException } from "@nestjs/common";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class GetUserPostsWithFiltersUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface,
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}

    async execute(userId: number,data: UserPostFiltersDto){
        const office = await this.officeRepo.findOneByUserId(userId);

        if(!office){ 
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب عقاري خاص بك',400)
            );
        }

        const officeId = office.id;
        return await this.userPostRepo.getWithFilters(officeId,data);
    }
}