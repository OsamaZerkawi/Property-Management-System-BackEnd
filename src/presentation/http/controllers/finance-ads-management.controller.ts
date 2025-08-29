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
import { RespondToAdRequestDto } from 'src/application/dtos/advertisement/respond-to-ad-request.dto';
import { ApproveAdvertisementRequestUseCase } from 'src/application/use-cases/advertisement/approve-ad-request.use-case';
import { GetAllAdvertisementInvoicesUseCase } from 'src/application/use-cases/advertisement/get-all-advertisement-invoices.use-case';
import { GetApprovedAdvertisementUseCase } from 'src/application/use-cases/advertisement/get-approved-ads.use-case';
import { GetPendingAdvertisementUseCase } from 'src/application/use-cases/advertisement/get-pending-ads.use-case';
import { RejectAdRequestUseCase } from 'src/application/use-cases/advertisement/reject-ad-request.use-case';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { successResponse } from 'src/shared/helpers/response.helper';
import { GetApprovedAdsSwaggerDoc } from '../swagger/advertisement/get-apporved-ads.swagger';
import { RespondToAdRequestSwaggerDoc } from '../swagger/advertisement/respond-to-ad-requset.swgger';
import { GetAllAdvertisementInvoicesSwaggerDoc } from '../swagger/advertisement/get-all-ads-invoices.swagger';
import { GetAdRequestsSwaggerDoc } from '../swagger/advertisement/get-ad-request.swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UpdateStripeCustomerDto } from 'src/application/dtos/user/update-stripe-id.dto';
import { UpdateStripeCustomerUseCase } from 'src/application/use-cases/user/update-stripe-customer.use-case';
import { UpdateStripeCustomerSwaggerDoc } from '../swagger/admins/update-stirpe-customer.swagger';
import { GetStripeCustomerUseCase } from 'src/application/use-cases/user/get-stripe-customer.use-case';
import { GetStripeCustomerSwaggerDoc } from '../swagger/admins/get-stripe-customer.swagger';

@ApiTags('Finance & Ads Management')
@Controller('admin/finance-ads-management')
export class FinanceAdsManagementController {
  constructor(
    private readonly getPendingAdvertisementUseCase: GetPendingAdvertisementUseCase,
    private readonly approveAdRequestUseCase: ApproveAdvertisementRequestUseCase,
    private readonly rejectAdRequestUseCase: RejectAdRequestUseCase,
    private readonly getApprovedAdvertisementUseCase: GetApprovedAdvertisementUseCase,
    private readonly getAllAdvertisementInvoicesUseCase: GetAllAdvertisementInvoicesUseCase,
    private readonly updateStripeCustomerUseCase: UpdateStripeCustomerUseCase,
    private readonly getStripeCustomerUseCase: GetStripeCustomerUseCase,
  ) {}

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة المالية والإعلانات')
  @GetAdRequestsSwaggerDoc()
  @Get('ad-requests')
  @HttpCode(HttpStatus.OK)
  async getAdRequests(@Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const ads = await this.getPendingAdvertisementUseCase.execute(baseUrl);

    return successResponse(ads, 'تم إرجاع جميع طلبات الإعلانات', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة المالية والإعلانات')
  @HttpCode(HttpStatus.OK)
  @RespondToAdRequestSwaggerDoc()
  @Post('ad-request/:id/respond')
  async respondToAdRequest(
    @Param('id') id: number,
    @Body() data: RespondToAdRequestDto,
  ) {
    if (data.approved) {
      await this.approveAdRequestUseCase.execute(id);
    } else {
      await this.rejectAdRequestUseCase.execute(id, data.reason);
    }

    return successResponse([], 'تم الرد على طلب الإعلان', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة المالية والإعلانات')
  @GetApprovedAdsSwaggerDoc()
  @Get('approved-ads')
  @HttpCode(HttpStatus.OK)
  async getApprovedAds(@Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const ads = await this.getApprovedAdvertisementUseCase.execute(baseUrl);

    return successResponse(ads, 'تم إرجاع الإعلانات الحالية', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة المالية والإعلانات')
  @HttpCode(HttpStatus.OK)
  @GetAllAdvertisementInvoicesSwaggerDoc()
  @Get('ad-invoices')
  async getAllAdvertisementInvoices(@Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const data = await this.getAllAdvertisementInvoicesUseCase.execute(baseUrl);

    return successResponse(data, 'تم إرجاع جميع فواتير الإعلانات بنجاح', 200);
  }

  @Roles('مدير')
  @Permissions('إدارة المالية والإعلانات')
  @GetStripeCustomerSwaggerDoc()
  @Get('/stripe')
  async getStripeId(
    @CurrentUser() user,
  ) {
    const userId = user.sub;

    const stripeCustomerId = await this.getStripeCustomerUseCase.execute(userId);

    return successResponse({stripeCustomerId}, 'تم تعديل تفاصيل البطاقة بنجاح', 200);
  }

  @Roles('مدير')
  @Permissions('إدارة المالية والإعلانات')
  @UpdateStripeCustomerSwaggerDoc()
  @Put('/stripe')
  async updateStripeId(
    @Body() dto: UpdateStripeCustomerDto,
    @CurrentUser() user,
  ) {
    const userId = user.sub;

    await this.updateStripeCustomerUseCase.execute(
      userId,
      dto.stripe_customer_id,
    );

    return successResponse([], 'تم تعديل تفاصيل البطاقة بنجاح', 200);
  }
}
