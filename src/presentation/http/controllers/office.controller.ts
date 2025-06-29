// src/presentation/http/controllers/office.controller.ts
import {
    Controller, Get, Post, Body, Put,Patch,
    Param,
    HttpCode, HttpStatus, UseGuards,UseInterceptors,UploadedFile,BadRequestException
  } from "@nestjs/common";
  import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
  import { CreateOfficeUseCase } from "src/application/use-cases/office/create-office.usecase";
  import { UpdateOfficeUseCase } from "src/application/use-cases/office/update-office.usecase";
  import { CurrentUser } from "src/shared/decorators/current-user.decorator";
  import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
  import { successResponse } from "src/shared/helpers/response.helper";
  import { CreateOfficeDto } from "src/application/dtos/office/create-office.dto";
  import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';
  import { GetOfficeDetailsUseCase } from 'src/application/use-cases/office/get-office-details.usecase';
  import { OfficeResource } from 'src/presentation/http/resources/office.resource';
  import { GetOfficePaymentMethodUseCase } from 'src/application/use-cases/office/get-office-payment-method.use-case';
  import { GetPaymentMethodDto } from 'src/application/dtos/office/get-payment-method.dto'; 
  import {OfficeLogoInterceptor} from  "src/shared/interceptors/file-upload.interceptor";
  @Controller('office')
  export class OfficeController {
    constructor(
      private readonly getCommissionOfOfficeUseCase: GetCommissionOfOfficeUseCase,
      private readonly createOfficeUseCase: CreateOfficeUseCase,
      private readonly updateOfficeUseCase: UpdateOfficeUseCase,
      private readonly getOfficeDetailsUseCase: GetOfficeDetailsUseCase,
      private readonly getPaymentMethodUseCase: GetOfficePaymentMethodUseCase
    ) {}

    @Get('/payment-method')
    @UseGuards(JwtAuthGuard)
    async getPaymentMethod(
      @CurrentUser() user, 
    ) { 
      const userId =  user.sub; 
      const data = await this.getPaymentMethodUseCase.execute(userId);
      return successResponse(data, 'تم ارجاع طريقة الدفع', 200);
    }


    @Get('/commission')
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
      const result = await this.updateOfficeUseCase.execute(userId, dto);
      return successResponse(result, 'تم تحديث بيانات المكتب بنجاح', 200);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOfficeDetails(
      @CurrentUser() user, 
    ) { 
      const userId = user.sub;
      const officeEntity = await this.getOfficeDetailsUseCase.execute(userId);
      const data = OfficeResource.toJson(officeEntity);
      return successResponse(data, 'تم جلب بيانات المكتب بنجاح', 200);
    }
  }
 