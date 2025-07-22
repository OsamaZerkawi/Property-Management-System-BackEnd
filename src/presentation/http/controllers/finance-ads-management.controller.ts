import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { RespondToAdRequestDto } from "src/application/dtos/advertisement/respond-to-ad-request.dto";
import { ApproveAdvertisementRequestUseCase } from "src/application/use-cases/advertisement/approve-ad-request.use-case";
import { GetAllAdvertisementInvoicesUseCase } from "src/application/use-cases/advertisement/get-all-advertisement-invoices.use-case";
import { GetApprovedAdvertisementUseCase } from "src/application/use-cases/advertisement/get-approved-ads.use-case";
import { GetPendingAdvertisementUseCase } from "src/application/use-cases/advertisement/get-pending-ads.use-case";
import { RejectAdRequestUseCase } from "src/application/use-cases/advertisement/reject-ad-request.use-case";
import { Permissions } from "src/shared/decorators/permission.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@ApiTags('Finance & Ads Management')


@Controller('finance-ads-management')
export class FinanceAdsManagementController {
    constructor(
        private readonly getPendingAdvertisementUseCase: GetPendingAdvertisementUseCase,
        private readonly approveAdRequestUseCase: ApproveAdvertisementRequestUseCase,
        private readonly rejectAdRequestUseCase: RejectAdRequestUseCase,
        private readonly getApprovedAdvertisementUseCase: GetApprovedAdvertisementUseCase,
        private readonly getAllAdvertisementInvoicesUseCase: GetAllAdvertisementInvoicesUseCase
    ){}


    @Roles('مشرف')
    @Permissions('إدارة المالية والإعلانات')
    @Get('ad-requests')
    @HttpCode(HttpStatus.OK)
    async getAdRequests(
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const ads = await this.getPendingAdvertisementUseCase.execute(baseUrl);

        return successResponse(ads,'تم إرجاع جميع طلبات الإعلانات',200);
    }

    @Roles('مشرف')
    @Permissions('إدارة المالية والإعلانات')
    @HttpCode(HttpStatus.OK)
    @Post('ad-request/:id/respond')
    async respondToAdRequest(
        @Param('id') id: number,
        @Body() data: RespondToAdRequestDto,
    ){
        if(data.approved){
            await this.approveAdRequestUseCase.execute(id);
        }else{
            await this.rejectAdRequestUseCase.execute(id,data.reason)
        }

        return successResponse([],'تم الرد على طلب الإعلان',200)
    }

    @Roles('مشرف')
    @Permissions('إدارة المالية والإعلانات')
    @Get('approved-ads')
    @HttpCode(HttpStatus.OK)
    async getApprovedAds(
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const ads = await this.getApprovedAdvertisementUseCase.execute(baseUrl);

        return successResponse(ads,'تم إرجاع الإعلانات الحالية',200);
    }

    @Roles('مشرف')
    @Permissions('إدارة المالية والإعلانات')
    @HttpCode(HttpStatus.OK)
    @Get('ad-invoices')
    async getAllAdvertisementInvoices(
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        
        const data = await this.getAllAdvertisementInvoicesUseCase.execute(baseUrl);

        return successResponse(data,'تم إرجاع جميع فواتير الإعلانات بنجاح',200)
    }    
}