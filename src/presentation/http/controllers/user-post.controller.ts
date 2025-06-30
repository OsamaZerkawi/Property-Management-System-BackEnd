import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { GetUserPostsWithFiltersUseCase } from "src/application/use-cases/user-post/get-user-posts-with-filters.use-case";
import { GetUserPostsUseCase } from "src/application/use-cases/user-post/get-user-posts.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('user-post')
export class UserPostController {
    constructor(
        private readonly getUserPostsUseCase: GetUserPostsUseCase,
        private readonly getUserPostsWithFiltersUseCase: GetUserPostsWithFiltersUseCase,
    ){}

    @Roles('صاحب مكتب')
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllPosts(
        @CurrentUser() user,
    ){
        const userId = user.sub;
        const posts = await this.getUserPostsUseCase.execute(userId);

        return successResponse(posts,'تم ارجاع جميع منشورات المستخدمين بنجاح',200);
    }

    @Roles('صاحب مكتب')
    @Get('filters')
    @HttpCode(HttpStatus.OK)
    async getAllPostsWithFilters(
        @Query() filters: UserPostFiltersDto,
        @CurrentUser() user,
    ){
        const userId = user.sub;
        const posts = await this.getUserPostsWithFiltersUseCase.execute(userId,filters);

        return successResponse(posts,'تم ارجاع جميع منشورات المستخدمين بنجاح',200);

    }
}