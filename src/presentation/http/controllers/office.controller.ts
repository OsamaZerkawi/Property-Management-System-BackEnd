import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('office')
export class OfficeController {
    constructor(
        private readonly getCommissionOfOfficeUseCase : GetCommissionOfOfficeUseCase,
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

}