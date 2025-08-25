import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { FindAllUserInvoicesUseCase } from "src/application/use-cases/user-invoices/find-all-user-invoices.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
import { GetOwnInvoicesSwaggerDoc } from "../swagger/user-invoices/get-own-invoices-for-property.swagger";
import { PayInvoiceUseCase } from "src/application/use-cases/user-invoices/pay-invoice.usecase";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { PayInvoiceDto } from "src/application/dtos/property/pay-invoice.dto";

@Controller('user-invoice')
export class UserInvoiceController {
    constructor(
        private readonly findAllUserInvoicesUseCase: FindAllUserInvoicesUseCase,
        private readonly payInvoiceUseCase: PayInvoiceUseCase

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
    
    @Post(':invoiceId')
    @UseGuards(JwtAuthGuard)   
    @HttpCode(HttpStatus.OK)
    async payInvoice(
    @Param('invoiceId') invoiceId: number,
    @Body() dto: PayInvoiceDto,
  ) {
    console.log(invoiceId)
    console.log(dto.paymentIntentId)
    const result = await this.payInvoiceUseCase.execute(invoiceId, dto.paymentIntentId);
    return successResponse(result, 'تم تسجيل الدفع بنجاح', HttpStatus.OK);
  }
}