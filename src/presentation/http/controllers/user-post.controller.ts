import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { REDIRECT_METADATA } from "@nestjs/common/constants";
import { Request } from "express";
import { UserPostFiltersDto } from "src/application/dtos/user-post/user-post-filters.dto";
import { DeleteUserPostUseCase } from "src/application/use-cases/user-post/delete-own-post.use-case";
import { FindUserPostSuggestionsUseCase } from "src/application/use-cases/user-post/find-user-post-suggestions.use-case";
import { GetOwnPostsWithStatusUseCase } from "src/application/use-cases/user-post/get-own-posts-by-status.use-case";
import { GetOwnPostsUseCase } from "src/application/use-cases/user-post/get-own-posts.use-case";
import { GetUserPostsWithFiltersUseCase } from "src/application/use-cases/user-post/get-user-posts-with-filters.use-case";
import { GetUserPostsUseCase } from "src/application/use-cases/user-post/get-user-posts.use-case";
import { UserPostAdminAgreement } from "src/domain/enums/user-post-admin-agreement.enum";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('user-post')
export class UserPostController {
    constructor(
        private readonly getUserPostsUseCase: GetUserPostsUseCase,
        private readonly getUserPostsWithFiltersUseCase: GetUserPostsWithFiltersUseCase,
        private readonly getOwnPostsUseCase: GetOwnPostsUseCase,
        private readonly getOwnPostsWithStatusUseCase: GetOwnPostsWithStatusUseCase,
        private readonly deleteUserPostUseCase: DeleteUserPostUseCase,
        private readonly findUserPostSuggestionsUseCase: FindUserPostSuggestionsUseCase,
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

    @Get('own')
    @HttpCode(HttpStatus.OK)
    async getOwnPosts(
        @CurrentUser() user,
    ){
        const userId = user.sub;
        
        const posts = await this.getOwnPostsUseCase.execute(userId);

        return successResponse(posts,'تم جلب جيمع المنشورات الخاصة بك',200);
    }

    @Get('own/filters')
    @HttpCode(HttpStatus.OK)
    async getOwnPostsWithStatus(
        @CurrentUser() user,
        @Query('status') status: UserPostAdminAgreement,
    ){
        const userId = user.sub;

        const posts = await this.getOwnPostsWithStatusUseCase.execute(userId,status);

        return successResponse(posts,'تم جلب جيمع المنشورات الخاصة بك مفلترة',200);
    }

    @Delete('own/:id')
    @HttpCode(HttpStatus.OK)
    async deletePost(
        @Param('id',ParseIntPipe) postId: number,
        @CurrentUser() user,
    ){
        const userId = user.sub;

        await this.deleteUserPostUseCase.execute(userId,postId);

        return successResponse([],'تم حذف المنشور بنجاح',200);
    }

    @Get('/:id/suggestions')
    @HttpCode(HttpStatus.OK)
    async getSuggestionsForUser(
        @Param('id',ParseIntPipe) id: number,
        @Req() request: Request,
        @CurrentUser() user,
    ){
        const userId = user.sub;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const suggestions = await this.findUserPostSuggestionsUseCase.execute(userId,id,baseUrl);

        return successResponse(suggestions,'تم جلب اقتراحات العقارات بنجاح',200);
    }
}