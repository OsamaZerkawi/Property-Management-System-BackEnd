import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Param, Post, UploadedFile, UseGuards } from "@nestjs/common";
import { UploadPropertyReservationDto } from "src/application/dtos/user-property-reservation/UploadProeprtyReservation.dto";
import { CreateUserProeprtyInvoiceUseCase } from "src/application/use-cases/user-property-reservation/create-user-property-invoice.use-case";
import { UploadInvoiceDocumentUseCase } from "src/application/use-cases/user-property-reservation/upload-document-invoice.use-case";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";
import { UserPropertyInvoiceImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";

@Controller('user-property-invoices')
export class UserPropertyInvoiceController {
    constructor(
        private readonly uploadInvoiceDocumentUseCase: UploadInvoiceDocumentUseCase,
        private readonly createUserProeprtyInvoiceUseCasec:CreateUserProeprtyInvoiceUseCase,
    ){}

    @Roles('صاحب مكتب')
    @UserPropertyInvoiceImageInterceptor()
    @HttpCode(HttpStatus.OK)
    @Post(':invoiceId/upload-docement')
    async uploadInvoiceDocumentOnline(
        @Param('invoiceId') invoiceId: number,
        @UploadedFile() file: Express.Multer.File,
    ){
        if(!file){
            throw new NotFoundException(
                errorResponse('لم يتم رفع صورة الوثيقة',404)
            );
        }

        await this.uploadInvoiceDocumentUseCase.execute(invoiceId,file.filename);

        return successResponse([],'تم رفع صورة الوثيقة بنجاح',200);
    }

    @Roles('صاحب مكتب')
    @HttpCode(HttpStatus.CREATED)
    @UserPropertyInvoiceImageInterceptor()
    @Post('/upload-docement')
    async uploadINvoiceDocumentOffline(
        @Body() data: UploadPropertyReservationDto,
        @UploadedFile() file: Express.Multer.File
    ){
        if(!file){
            throw new NotFoundException(
                errorResponse('لم يتم رفع صورة الوثيقة',404)
            );
        }

        await this.createUserProeprtyInvoiceUseCasec.execute(data,file.filename);

        return successResponse([],'تم رفع وثيقة الدفع بنجاح',200);
    }
}