
 
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
      private readonly listOfficesUseCase: ListOfficesUseCase
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
  async list(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
  @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const data = await this.listOfficesUseCase.execute(page,items,baseUrl);
    return successResponse(data, 'تم إرجاع قائمة المكاتب', 200);
  }
  }
   