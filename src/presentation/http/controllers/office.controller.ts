
 
import {
    Controller, Get, Post, Body, Put,Patch,
    Param,Query,
    HttpCode, HttpStatus, UseGuards,UseInterceptors,UploadedFile,BadRequestException,
    DefaultValuePipe,
    ParseIntPipe,
    Req
  } from "@nestjs/common";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { CreateOfficeUseCase } from "src/application/use-cases/office/create-office.usecase";
import { UpdateOfficeUseCase } from "src/application/use-cases/office/update-office.usecase";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
import { CreateOfficeDto } from "src/application/dtos/office/create-office.dto";
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';
import { GetOfficeDetailsUseCase } from 'src/application/use-cases/office/get-office-details.usecase';
import { OfficeResource } from 'src/presentation/http/resources/office.resource';
import { GetOfficePaymentMethodUseCase } from 'src/application/use-cases/office/get-office-payment-method.use-case';
import { OfficeLogoInterceptor} from  "src/shared/interceptors/file-upload.interceptor"; 
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto"; 
import { GetOfficeFeesUseCase } from "src/application/use-cases/office/get-office-fees.use-case";
import { UpdateOfficeFeesUseCase } from "src/application/use-cases/office/update-office-fees.use-case"; 
import { Roles } from "src/shared/decorators/role.decorator";  
import { Public } from "src/shared/decorators/public.decorator";
import { Request } from "express";
import { GetTopRatedOfficesUseCase } from "src/application/use-cases/office/get-top-rated-offices.use-case";
import { GetTopRatedOfficesSwaggerDoc } from "../swagger/office/get-top-rated";
import { CommissionSwaggerDocs } from "../swagger/office/get-commission.swagger";
import { PropertyFeeService } from "src/application/services/propertyFee.service";
import { GetPaymentMethodSwaggerDoc } from "../swagger/office/get-payment-method.swagger";
import { CreateOfficeSwaggerDoc } from "../swagger/office/create-office.swagger";
import { ListOfficesUseCase } from "src/application/use-cases/office/list-offices.use-case";
import { GetOfficeListSwaggerDoc } from "../swagger/office/get-office-list-swagger";
import { GetOfficeSearchSwaggerDoc } from "../swagger/office/get-office-search.swagger";
import { SearchOfficesUseCase } from "src/application/use-cases/office/search-office-by-name.use-case";
import { CreateOfficeRatingDto } from "src/application/dtos/office/create-office-rating.dto";
import { RateOfficeUseCase } from "src/application/use-cases/office/rate-office.usecase";
import { RateOfficeSwaggerDoc } from "../swagger/office/rate-office.swagger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateOfficeComplaintDto } from "src/application/dtos/office/create-office-complaint.dto";
import { CreateComplaintOfficeSwaggerDoc } from "../swagger/office/create-complaint-office.swagger";
import { ComplaintOfficeUseCase } from "src/application/use-cases/office/comlaint-office.use-case";
import { ShowOfficeDetailsSwaggerDoc } from "../swagger/office/show-office-details.swagger";
import { GetOfficeDetailsMobileUseCase } from "src/application/use-cases/office/show-office-details-mobile";
import { GetOfficePropertiesUseCase } from "src/application/use-cases/office/get-office-properties.use-case";
import { GetOfficePropertiesSwaggerDoc } from "../swagger/office/get-office-properties.swagger";
     
  @Controller('office')
  export class OfficeController {
    constructor(
      private readonly getCommissionOfOfficeUseCase: GetCommissionOfOfficeUseCase,
      private readonly createOfficeUseCase: CreateOfficeUseCase,
      private readonly updateOfficeUseCase: UpdateOfficeUseCase,
      private readonly getOfficeDetailsUseCase: GetOfficeDetailsUseCase,
      private readonly getPaymentMethodUseCase: GetOfficePaymentMethodUseCase ,
      private readonly getOfficeFeesUseCase: GetOfficeFeesUseCase,
      private readonly updateOfficeFeesUseCase: UpdateOfficeFeesUseCase,
      private readonly getTopRatedOfficesUseCase: GetTopRatedOfficesUseCase,
      private readonly propertyFeeService: PropertyFeeService,
      private readonly listOfficesUseCase: ListOfficesUseCase,
      private readonly searchOfficesUseCase: SearchOfficesUseCase,
      private readonly rateOfficeUseCase: RateOfficeUseCase,
      private readonly complaintOfficeUseCase: ComplaintOfficeUseCase,
      private readonly getOfficeDetailsMobileUseCase: GetOfficeDetailsMobileUseCase,
      private readonly getOfficePropertiesUseCase: GetOfficePropertiesUseCase,

    ) {}

    @Get('/payment-method')
    @GetPaymentMethodSwaggerDoc()
    @UseGuards(JwtAuthGuard)
    async getPaymentMethod(
      @CurrentUser() user, 
    ) { 
      const userId =  user.sub; 
      const data = await this.getPaymentMethodUseCase.execute(userId);
      return successResponse(data, 'تم ارجاع طريقة الدفع', 200);
    }
 
    @Get('/commission')
    @CommissionSwaggerDocs()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCommissionOfOffice(@CurrentUser() user) {
      const userId = user.sub;
      const data = await this.getCommissionOfOfficeUseCase.execute(userId);
      return successResponse(data, 'تم ارجاع عمولة المكتب', 200);
    }
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @CreateOfficeSwaggerDoc()
    @OfficeLogoInterceptor()
    async createOffice(
      @CurrentUser() user,
      @Body() dto: CreateOfficeDto,
      @UploadedFile() logoFile: Express.Multer.File,
    ) { 
      if (logoFile) {
        dto.logo = logoFile.filename;
      } 
      const result = await this.createOfficeUseCase.execute(user.sub, dto);
      return successResponse(result, 'تم إنشاء المكتب بنجاح', HttpStatus.CREATED);
    }
  
    @Patch()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateOffice(
      @CurrentUser() user, 
      @Body() dto: UpdateOfficeDto
    ) {
      const userId = user.sub; 
      await this.updateOfficeUseCase.execute(userId, dto);
      return successResponse( [], 'تم تحديث بيانات المكتب بنجاح', 200);
    }
 
 
    @Get()
    @HttpCode(HttpStatus.OK)
    async getOfficeDetails(
      @CurrentUser() user, 
    ) { 
      const userId = user.sub;
      const officeEntity = await this.getOfficeDetailsUseCase.execute(userId);
      const data = OfficeResource.toJson(officeEntity);
      return successResponse(data, 'تم جلب بيانات المكتب بنجاح', 200);
    }

    @Get('top-rated')
    @GetTopRatedOfficesSwaggerDoc()
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
    @UseGuards(JwtAuthGuard)
    @Get(':property_id/commission-and-price')
    async getPropertyFees(
    @CurrentUser() user: any,
    @Param('property_id') propertyId: number
  ) { 
    return this.propertyFeeService.getCommissionAndRental(propertyId, user.sub);
  }

  @Get('list')
  @Public()
  @GetOfficeListSwaggerDoc()
  async list(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
    @Query('city_id') cityId?: number,
    @Query('region_id') regionId?: number,
    @Query('type') type?: string,
    @Query('rate') rate?: number,  

  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const { data, total } = await this.listOfficesUseCase.execute(
      page,
      items,
      baseUrl,
      cityId,
      regionId,
      type,
      rate,
    );

    return successPaginatedResponse(
      data,
      total,
      page,
      items,
      'تم إرجاع قائمة المكاتب',
      200,
    );
  }

  @Get('search')
  @Public()
  @GetOfficeSearchSwaggerDoc()
  async searchByName(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
    @Req() req: Request,
  ) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('q (search query) is required');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const { data, total } = await this.searchOfficesUseCase.searchByName(
      name.trim(),
      page,
      items,
      baseUrl,
    );

    return successPaginatedResponse(
      data,
      total,
      page,
      items,
      'تم إرجاع نتائج البحث',
      200,
    );
  }

  @Post('rate')
  @UseInterceptors(FileFieldsInterceptor([]))  
  @RateOfficeSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  async rateOffice(
    @CurrentUser() user: any,
    @Body() dto: CreateOfficeRatingDto,
  ) {
    await this.rateOfficeUseCase.execute(user.sub, dto);
    return successResponse( [], 'تم تقييم المكتب بنجاح', HttpStatus.CREATED);
  }

  @Post('report')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([]))  
  @CreateComplaintOfficeSwaggerDoc()
  async reportOffice(
    @CurrentUser() user: any,
    @Body() dto: CreateOfficeComplaintDto,
  ) {
    await this.complaintOfficeUseCase.execute(user.sub, dto);
    return successResponse([], 'تم إرسال البلاغ بنجاح', HttpStatus.CREATED);
  }

  @Get(':id')
  @Public()
  @ShowOfficeDetailsSwaggerDoc()
  async getOfficeDetailsMobile(
    @Param('id') officeId: number,
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data = await this.getOfficeDetailsMobileUseCase.execute(Number(officeId), baseUrl);
    return successResponse(data, 'تم إرجاع تفاصيل المكتب بنجاح');
  }

  @Get(':officeId/properties')
  @Public()
  @GetOfficePropertiesSwaggerDoc()
  async getOfficeProperties(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
    @Param('officeId', ParseIntPipe) officeId: number,
    @Req() req: Request,
    @Query('property_type') propertyType?: string,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const {total,data} = await this.getOfficePropertiesUseCase.execute(
      page,
      items,
      baseUrl,
      officeId,
      propertyType,
    );
   return successPaginatedResponse(data,total,page,items,'تم ارجاع العقارات بنجاح'); 
  }
}
   