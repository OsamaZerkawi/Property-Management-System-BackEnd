import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { successResponse } from 'src/shared/helpers/response.helper';
import { GetPendingUserPostsSwaggerDoc } from '../swagger/user-post/get-pending-posts.swagger';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';
import { GetPostsByStatusUseCase } from 'src/application/use-cases/admin-user-post/get-posts-by-status.use-case';
import { RespondToAdRequestDto } from 'src/application/dtos/advertisement/respond-to-ad-request.dto';
import { RespondToUserPostUseCase } from 'src/application/use-cases/admin-user-post/respond-to-post.use-case';
import { RespondToUserPostSwaggerDoc } from '../swagger/user-post/respond-to-post.swagger';

@Controller('admin/user-posts')
export class AdminUserPostController {
  constructor(
    private readonly getPostsByStatusUseCase: GetPostsByStatusUseCase,
    private readonly respondToUserPostUseCase: RespondToUserPostUseCase,
  ) {}

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة المنشورات')
  @GetPendingUserPostsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUserPostsByStatus(@Query('status') status: UserPostAdminAgreement) {
    const result = await this.getPostsByStatusUseCase.execute(status);

    return successResponse(result, 'تم إرجاع جميع منشورات المستخدمين', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة المنشورات')
  @RespondToUserPostSwaggerDoc()
  @Put(':id/respond')
  async respondToPost(
    @Param('id') id: number,
    @Body() respondDto: RespondToAdRequestDto,
  ) {
    await this.respondToUserPostUseCase.execute(id, respondDto);

    return successResponse([], 'تم الرد على طلب المنشور بنجاح', 200);
  }
}
