import { Controller, Get, HttpCode, HttpStatus, Param, Put, Query, UseGuards } from "@nestjs/common";
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { GetOfficeFeesUseCase } from "src/application/use-cases/office/get-office-fees.use-case";
import { UpdateOfficeFeesUseCase } from "src/application/use-cases/office/update-office-fees.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('office')
export class OfficeController {
    constructor(
        private readonly getCommissionOfOfficeUseCase : GetCommissionOfOfficeUseCase,
        private readonly getOfficeFeesUseCase: GetOfficeFeesUseCase,
        private readonly updateOfficeFeesUseCase: UpdateOfficeFeesUseCase
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCommissionOfOffice(
        @CurrentUser() user,
    ){
        const userId = user.sub;

        const data = await this.getCommissionOfOfficeUseCase.execute(userId);

        return successResponse(data,'تم ارجاع عمولة المكتب',200);
    }

    @Get('fees')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getFees(
        @CurrentUser() user,
    ){
        const userId = user.sub;

        const data = await this.getOfficeFeesUseCase.execute(userId);

        return successResponse(data,'تم ارجاع رسوم المكتب',200);
    }

    @Put('fees')
    @UseGuards(JwtAuthGuard)
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