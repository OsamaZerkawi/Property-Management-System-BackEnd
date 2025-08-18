import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { REDIRECT_METADATA } from '@nestjs/common/constants';
import { Request } from 'express';
import { UserPostFiltersDto } from 'src/application/dtos/user-post/user-post-filters.dto';
import { DeleteUserPostUseCase } from 'src/application/use-cases/user-post/delete-own-post.use-case';
import { FindUserPostSuggestionsUseCase } from 'src/application/use-cases/user-post/find-user-post-suggestions.use-case';
import { GetOwnPostsWithStatusUseCase } from 'src/application/use-cases/user-post/get-own-posts-by-status.use-case';
import { GetOwnPostsUseCase } from 'src/application/use-cases/user-post/get-own-posts.use-case';
import { GetUserPostsWithFiltersUseCase } from 'src/application/use-cases/user-post/get-user-posts-with-filters.use-case';
import { GetUserPostsUseCase } from 'src/application/use-cases/user-post/get-user-posts.use-case';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import {
  successPaginatedResponse,
  successResponse,
} from 'src/shared/helpers/response.helper';
import { GetOwnPostsSwaggerDoc } from '../swagger/user-post/get-own-posts.swagger';
import { GetUserPostSuggestionsSwaggerDoc } from '../swagger/user-post/get-suggestions.swagger';
import { GetOwnPostsWithStatusSwaggerDoc } from '../swagger/user-post/get-own-posts-with-filter.swagger';
import { DeleteUserPostSwaggerDoc } from '../swagger/user-post/delete-post.swagger';
import { CreateUserPostDto } from 'src/application/dtos/user-post/create-post.dto';
import { CreateUserPostUseCase } from 'src/application/use-cases/user-post/create-post.use-case';
import { CreateUserPostSwaggerDoc } from '../swagger/user-post/create-post.swagger';
import { GetAllPostsSwaggerDoc } from '../swagger/user-post/get-all-user-posts.swagger';
import { GetAllUserPostsWithFiltersSwaggerDoc } from '../swagger/user-post/get-all-user-posts-with-filters.swagger';

@Controller('user-post')
export class UserPostController {
  constructor(
    private readonly getUserPostsUseCase: GetUserPostsUseCase,
    private readonly getUserPostsWithFiltersUseCase: GetUserPostsWithFiltersUseCase,
    private readonly getOwnPostsUseCase: GetOwnPostsUseCase,
    private readonly getOwnPostsWithStatusUseCase: GetOwnPostsWithStatusUseCase,
    private readonly deleteUserPostUseCase: DeleteUserPostUseCase,
    private readonly findUserPostSuggestionsUseCase: FindUserPostSuggestionsUseCase,
    private readonly createUserPostUseCase: CreateUserPostUseCase,
  ) {}

  @Roles('صاحب مكتب')
  @Get()
  @GetAllPostsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(@CurrentUser() user) {
    const userId = user.sub;
    const posts = await this.getUserPostsUseCase.execute(userId);

    return successResponse(
      posts,
      'تم ارجاع جميع منشورات المستخدمين بنجاح',
      200,
    );
  }

  @Roles('صاحب مكتب')
  @Get('filters')
  @GetAllUserPostsWithFiltersSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getAllPostsWithFilters(
    @Query() filters: UserPostFiltersDto,
    @CurrentUser() user,
  ) {
    const userId = user.sub;
    const data = await this.getUserPostsWithFiltersUseCase.execute(
      userId,
      filters,
    );

    return successResponse(data, 'تم ارجاع جميع منشورات المستخدمين بنجاح', 200);
  }

  @Post('own')
  @CreateUserPostSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() data: CreateUserPostDto, @CurrentUser() user) {
    const userId = user.sub;
    const result = await this.createUserPostUseCase.execute(userId, data);

    return successResponse([], 'تم إنشاء المنشور بنجاح', 201);
  }

  @Get('own')
  @GetOwnPostsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getOwnPosts(@CurrentUser() user) {
    const userId = user.sub;

    const posts = await this.getOwnPostsUseCase.execute(userId);

    return successResponse(posts, 'تم جلب جيمع المنشورات الخاصة بك', 200);
  }

  @Get('own/filters')
  @GetOwnPostsWithStatusSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getOwnPostsWithStatus(
    @CurrentUser() user,
    @Query('status') status: UserPostAdminAgreement,
  ) {
    const userId = user.sub;

    const posts = await this.getOwnPostsWithStatusUseCase.execute(
      userId,
      status,
    );

    return successResponse(
      posts,
      'تم جلب جيمع المنشورات الخاصة بك مفلترة',
      200,
    );
  }

  @Delete('own/:id')
  @DeleteUserPostSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser() user,
  ) {
    const userId = user.sub;

    await this.deleteUserPostUseCase.execute(userId, postId);

    return successResponse([], 'تم حذف المنشور بنجاح', 200);
  }

  @Get('/:id/suggestions')
  @GetUserPostSuggestionsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getSuggestionsForUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @CurrentUser() user,
  ) {
    const userId = user.sub;

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const { suggestions, total } =
      await this.findUserPostSuggestionsUseCase.execute(
        userId,
        page,
        items,
        id,
        baseUrl,
      );

    return successPaginatedResponse(
      suggestions,
      total,
      page,
      items,
      'تم جلب اقتراحات العقارات بنجاح',
      200,
    );
  }
}
