import { Controller, Get, HttpCode, HttpStatus, Param, Req } from "@nestjs/common";
import { Request } from "express";
import { FindAllUserInvoicesUseCase } from "src/application/use-cases/user-invoices/find-all-user-invoices.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
import { GetOwnInvoicesSwaggerDoc } from "../swagger/user-invoices/get-own-invoices-for-property.swagger";

@Controller('user-invoice')
export class UserInvoiceController {
    constructor(
        private readonly findAllUserInvoicesUseCase: FindAllUserInvoicesUseCase,
    ){}

    @Get('own/properties/:propertyId')
    @GetOwnInvoicesSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getOwnInvoices(
        @CurrentUser() user,
        @Param('propertyId') propertyId: number,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const userId = user.sub;

        const invoices = await this.findAllUserInvoicesUseCase.execute(userId,propertyId,baseUrl);

        return successResponse(invoices,'تم ارجاع جميع الفواتير المتعلقة بهذا العقد',200);

    }

}