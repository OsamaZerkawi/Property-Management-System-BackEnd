import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UploadedFile } from "@nestjs/common";
import { CreateAdvertisementUseCase } from "src/application/use-cases/advertisement/create-advertisement.use-case";
import { ListOfficeInvoicesUseCase } from "src/application/use-cases/advertisement/list-advertisement-invoices.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";
import { AdvertisementImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";
import { GetAllOfficeInvoicesSwaggerDoc } from "../swagger/advertisement/get-all-office-invoices.swagger";
import { InvoiceType } from "src/domain/enums/invoice.type.enum";
import { ServiceType } from "src/domain/enums/service-type.enum";

@Controller('advertisement')
export class AdvertisementController {
    constructor(
        private readonly createAdvertisementUseCase: CreateAdvertisementUseCase,
        private readonly listOfficeInvoicesUseCase: ListOfficeInvoicesUseCase,
    ){}

    @Get('/invoices')
    @GetAllOfficeInvoicesSwaggerDoc()
    @Roles('صاحب مكتب')
    async getAll(
        @CurrentUser() user,
        @Query('type') type: ServiceType
    ){
        const userId = user.sub;
        const data = await this.listOfficeInvoicesUseCase.execute(userId,type);

        return successResponse(data,'تم إرجاع جميع السجلات الخاصة بالإعلانات ',200);
    }
    
    @Post('imageAd')
    @Roles('صاحب مكتب')
    @HttpCode(HttpStatus.CREATED)
    @AdvertisementImageInterceptor()
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body('day_period') period: number,
        @CurrentUser() user,
    ){
        const userId = user.sub;

        await this.createAdvertisementUseCase.execute(userId,period,file);

        return successResponse([],'تم ارسال طلب الإعلان بنجاح',201)
    }
}