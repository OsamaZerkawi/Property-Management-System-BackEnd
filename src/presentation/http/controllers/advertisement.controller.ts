import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile } from "@nestjs/common";
import { CreateAdvertisementUseCase } from "src/application/use-cases/advertisement/create-advertisement.use-case";
import { ListOfficeInvoicesUseCase } from "src/application/use-cases/advertisement/list-advertisement-invoices.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";
import { AdvertisementImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";

@Controller('advertisement')
export class AdvertisementController {
    constructor(
        private readonly createAdvertisementUseCase: CreateAdvertisementUseCase,
        private readonly listOfficeInvoicesUseCase: ListOfficeInvoicesUseCase,
    ){}

    @Get('/invoices')
    // @Roles('صاحب مكتب')
    async getAll(
        @CurrentUser() user,
    ){
        const userId = user.sub;
        const data = await this.listOfficeInvoicesUseCase.execute(userId);
        console.log(data);

        return successResponse(data,'تم إرجاع جميع السجلات الخاصة بالإعلانات ',200);
    }
    
    @Post()
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