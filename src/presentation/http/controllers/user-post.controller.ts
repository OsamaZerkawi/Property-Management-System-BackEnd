import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { GetUserPostsWithFiltersUseCase } from "src/application/use-cases/user-post/get-user-posts-with-filters.use-case";
import { GetUserPostsUseCase } from "src/application/use-cases/user-post/get-user-posts.use-case";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('user-post')
export class UserPostController {
    constructor(
        private readonly getUserPostsUseCase: GetUserPostsUseCase,
        private readonly getUserPostsWithFiltersUseCase: GetUserPostsWithFiltersUseCase,
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAllPosts(){
        const posts = await this.getUserPostsUseCase.execute();

        return successResponse(posts,'تم ارجاع جميع منشورات المستخدمين بنجاح',200);
    }

    @Get('filters')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAllPostsWithFilters(
        @Query() filters: UserPostFiltersDto,
    ){
        const posts = await this.getUserPostsWithFiltersUseCase.execute(filters);

        return successResponse(posts,'تم ارجاع جميع منشورات المستخدمين بنجاح',200);

    }
}