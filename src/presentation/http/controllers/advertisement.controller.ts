import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UploadedFile,Req} from "@nestjs/common";
import { CreateAdvertisementUseCase } from "src/application/use-cases/advertisement/create-advertisement.use-case";
import { ListOfficeInvoicesUseCase } from "src/application/use-cases/advertisement/list-advertisement-invoices.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";
import { AdvertisementImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";
import { GetAllOfficeInvoicesSwaggerDoc } from "../swagger/advertisement/get-all-office-invoices.swagger";
import { ServiceType } from "src/domain/enums/service-type.enum";
import { CreateImageAdSwaggerDoc } from "../swagger/advertisement/create-image-ad.swagger";
import { Public } from "src/shared/decorators/public.decorator";
import { ShowOfficeAdsSwaggerDoc } from "../swagger/advertisement/show-office-ads.swagger";
import { Request } from "express";
import { GetAdvertisementsUseCase } from "src/application/use-cases/advertisement/get-office-ads.use-case";
@Controller('advertisement')
export class AdvertisementController {
    constructor(
        private readonly createAdvertisementUseCase: CreateAdvertisementUseCase,
        private readonly listOfficeInvoicesUseCase: ListOfficeInvoicesUseCase,
        private readonly getAdvertisementsUseCase: GetAdvertisementsUseCase,

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
    @CreateImageAdSwaggerDoc()
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
  @Get()
  @Public()
  @ShowOfficeAdsSwaggerDoc()
  async getOfficeAdsImages( 
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const images = await this.getAdvertisementsUseCase.execute(baseUrl);
    return successResponse(images, 'تم إرجاع صور الإعلانات بنجاح');
  }
}