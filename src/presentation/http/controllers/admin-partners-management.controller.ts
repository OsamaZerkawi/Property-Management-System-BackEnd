import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { respondToJoinRequestsDto } from 'src/application/dtos/auth/respond-to-join-request.dto';
import { RespondToJoinRequestUseCase } from 'src/application/use-cases/join-requests/respond-to-join-requests.use-case';
import { GetOfficesByAdminCityUseCase } from 'src/application/use-cases/office/get-offices-by-admin-city.use-case';
import { GetServiceProvidersByAdminCityUseCase } from 'src/application/use-cases/service-provider/get-service-provider-by-admin-city.use-case';
import { GetServiceProviderDetailsUseCase } from 'src/application/use-cases/service-provider/get-service-provider-details.use-case';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { successResponse } from 'src/shared/helpers/response.helper';
import { GetOfficesSwaggerDoc } from '../swagger/admin-partners-management/get-all-offices.swagger';
import { GetServiceProvidersSwaggerDoc } from '../swagger/admin-partners-management/get-all-service-providers.swagger';
import { GetServiceProviderSwaggerDoc } from '../swagger/admin-partners-management/get-service-provider.swagger';
import { RespondToJoinRequestSwaggerDoc } from '../swagger/admin-partners-management/respond-to-join-request.swagger';
import { GetJoinRequetsUseCase } from 'src/application/use-cases/join-requests/get-join-requets.use-case';
import { GetJoinRequestsSwaggerDoc } from '../swagger/admin-partners-management/get-join-requests.swagger';
import { GetPendingPropertyPostsUseCase } from 'src/application/use-cases/property-post/get-pending-property-post.use-case';
import { GetPendingPropertyPostsSwaggerDoc } from '../swagger/admin-partners-management/get-pending-property-posts.swagger';
import { RespondToAdRequestDto } from 'src/application/dtos/advertisement/respond-to-ad-request.dto';
import { RespondToPropertyPostUseCase } from 'src/application/use-cases/property-post/respond-to-property-post.use-case';
import { RespondToPropertyPostSwaggerDoc } from '../swagger/admin-partners-management/respond-to-property-post.swagger';
import { GetOfficeDetailsMobileUseCase } from 'src/application/use-cases/office/show-office-details-mobile';
import { base } from '@faker-js/faker/.';
import { GetOfficeDetailsSwaggerDoc } from '../swagger/admin-partners-management/get-office-details.swagger';

@ApiTags('Admin - Partners Management')
@Controller('admin/partners-management')
export class AdminPartnersManagementController {
  constructor(
    private readonly getOfficesByAdminCityUseCase: GetOfficesByAdminCityUseCase,
    private readonly getServiceProvidersByAdminCityUseCase: GetServiceProvidersByAdminCityUseCase,
    private readonly getServiceProviderDetailsUseCase: GetServiceProviderDetailsUseCase,
    private readonly respondToJoinRequestUseCase: RespondToJoinRequestUseCase,
    private readonly getJoinRequetsUseCase: GetJoinRequetsUseCase,
    private readonly getPendingPropertyPostsUseCase: GetPendingPropertyPostsUseCase,
    private readonly respondToPropertyPostUseCase: RespondToPropertyPostUseCase,
    private readonly getOfficeDetailsMobileUseCase: GetOfficeDetailsMobileUseCase,
  ) {}

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @Get('offices')
  @GetOfficesSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getOffices(@Req() request: Request, @CurrentUser() user) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const adminId = user.sub;
    const data = await this.getOfficesByAdminCityUseCase.execute(
      adminId,
      baseUrl,
    );

    return successResponse(data, 'تم إرجاع جميع المكاتب بنجاح', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @Get('offices/:id')
  @GetOfficeDetailsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getOfficeDetails(
    @Param('id') id: number,
    @Req() request: Request,
    @CurrentUser() user,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const result = await this.getOfficeDetailsMobileUseCase.execute(
      id,
      baseUrl,
    );

    return successResponse(result, 'تم إرجاع تفاصيل المكتب بنجاح', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @HttpCode(HttpStatus.OK)
  @GetPendingPropertyPostsSwaggerDoc()
  @Get('property-posts')
  async getPropertyPosts(@Req() request: Request, @CurrentUser() user) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const adminId = user.sub;

    const result = await this.getPendingPropertyPostsUseCase.execute(
      baseUrl,
      adminId,
    );

    return successResponse(result, 'تم إرجاع جميع منشورات العقارات بنجاح', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @HttpCode(HttpStatus.OK)
  @RespondToPropertyPostSwaggerDoc()
  @Put('property-posts/:id/respond')
  async respondToPropertyPost(
    @Param('id') id: number,
    @Body() data: RespondToAdRequestDto,
  ) {
    await this.respondToPropertyPostUseCase.execute(id, data);

    return successResponse([], 'تم الرد على منشور العقار', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @GetServiceProvidersSwaggerDoc()
  @Get('service-providers')
  @HttpCode(HttpStatus.OK)
  async getServiceProviders(@Req() request: Request, @CurrentUser() user) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const adminId = user.sub;

    const data = await this.getServiceProvidersByAdminCityUseCase.execute(
      adminId,
      baseUrl,
    );

    return successResponse(data, 'تم إرجاع جميع مزودي الخدمات بنجاح', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @GetServiceProviderSwaggerDoc()
  @Get('service-providers/:id')
  @HttpCode(HttpStatus.OK)
  async getServiceProvider(@Param('id') id: number, @Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const data = await this.getServiceProviderDetailsUseCase.execute(
      id,
      baseUrl,
    );

    return successResponse(data, 'تم إرجاع تفاصيل مزود الخدمة بنجاح', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الوسطاء')
  @GetJoinRequestsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  @Get('join-requests')
  async getJoinRequest(@Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const result = await this.getJoinRequetsUseCase.execute(baseUrl);

    return successResponse(result, 'تم إرجاع جميع الطلبات', 200);
  }

  @Roles('مشرف', 'مدير')
  @RespondToJoinRequestSwaggerDoc()
  @Permissions('إدارة الوسطاء')
  @HttpCode(HttpStatus.OK)
  @Post('join-requests/:id/respond')
  async respondToJoinRequest(
    @Param('id') id: number,
    @Body() data: respondToJoinRequestsDto,
  ) {
    const message = await this.respondToJoinRequestUseCase.execute(id, data);
    return successResponse([], message, 200);
  }
}
