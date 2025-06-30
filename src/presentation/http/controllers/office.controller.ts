import { Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { GetOfficeFeesUseCase } from "src/application/use-cases/office/get-office-fees.use-case";
import { GetTopRatedOfficesUseCase } from "src/application/use-cases/office/get-top-rated-offices.use-case";
import { UpdateOfficeFeesUseCase } from "src/application/use-cases/office/update-office-fees.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";

@Controller('office')
export class OfficeController {
    constructor(
        private readonly getCommissionOfOfficeUseCase : GetCommissionOfOfficeUseCase,
        private readonly getOfficeFeesUseCase: GetOfficeFeesUseCase,
        private readonly updateOfficeFeesUseCase: UpdateOfficeFeesUseCase,
        private readonly getTopRatedOfficesUseCase: GetTopRatedOfficesUseCase,
    ){}

    @Roles('صاحب مكتب')
    @Get()
    @HttpCode(HttpStatus.OK)
    async getCommissionOfOffice(
        @CurrentUser() user,
    ){
        const userId = user.sub;

        const data = await this.getCommissionOfOfficeUseCase.execute(userId);

        return successResponse(data,'تم ارجاع عمولة المكتب',200);
    }

    @Get('top-rated')
    @Public()
    async getTopRatedOffices(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const { data, total } = await this.getTopRatedOfficesUseCase.execute(page,items,baseUrl);

        return successPaginatedResponse(data, total, page, items, 'تم جلب المكاتب بنجاح', 200);

    }

    @Roles('صاحب مكتب')
    @Get('fees')
    @HttpCode(HttpStatus.OK)
    async getFees(
        @CurrentUser() user,
    ){
        const userId = user.sub;

        const data = await this.getOfficeFeesUseCase.execute(userId);

        return successResponse(data,'تم ارجاع رسوم المكتب',200);
    }

    @Roles('صاحب مكتب')
    @Put('fees')
    @HttpCode(HttpStatus.OK)
    async updateFees(
        @Query() data: UpdateOfficeFeesDto,
        @CurrentUser() user,
    ){
        const userId = user.sub;

        await this.updateOfficeFeesUseCase.execute(userId,data);

        return successResponse([],'تم تحديث معلومات الرسوم الخاصة بالمكتب بنجاح',200);
    }

}