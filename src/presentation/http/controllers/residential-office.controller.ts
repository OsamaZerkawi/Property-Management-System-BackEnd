import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CreateResidentialPropertyDto } from "src/application/dtos/property/createResidentialProperty.dto";
import { SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { UpdateResidentialPropertyDto } from "src/application/dtos/property/updateResidentialProperty.dto";
import { CreateResidentialPropertyDetailsUseCase } from "src/application/use-cases/property/create-residential-property-details.use-case";
import { GetExpectedPricePropertyUseCase } from "src/application/use-cases/property/get-expected-price.use-case";
import { GetPropertiesForOfficeWithFiltersUseCase } from "src/application/use-cases/property/get-properties-for-office-with-filters.use-case";
import { GetPropertiesForOfficeUseCase } from "src/application/use-cases/property/get-properties-for-office.use-case";
import { GetPropertyForOfficeUseCase } from "src/application/use-cases/property/get-propety-for-office.use-case";
import { SearchResidentialPropertyByTitleUseCase } from "src/application/use-cases/property/search-residential-property.dto";
import { UpdateResidentialPropertyDetailsUseCase } from "src/application/use-cases/property/update-residential-property-details.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";
import { PropertyPostImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";
import { GetOfficePropertiesSwaggerDoc, GetOfficePropertySwaggerDoc, SearchPropertiesSwaggerDoc, SearchTitlePropertiesSwaggerDoc } from "../swagger/decorators/residential-office/get-properties.decorator";
import { CreateResidentialPropertySwaggerDoc } from "../swagger/residential-office/create-property.swagger";
import { GetExpectedPriceSwaggerDoc } from "../swagger/residential-office/get-expected-price.swagger";
import { UpdateResidentialPropertySwaggerDoc } from "../swagger/residential-office/update-property.swagger";

@Controller('residential-office')
export class ResidentialOfficeController {
    constructor(
      private readonly createResidentialPropertyDetailsUseCase: CreateResidentialPropertyDetailsUseCase,
      private readonly getPropertiesForOfficeUseCase: GetPropertiesForOfficeUseCase,
      private readonly getPropertiesForOfficeWithFiltersUseCase: GetPropertiesForOfficeWithFiltersUseCase,
      private readonly getPropertyForOfficeUseCase: GetPropertyForOfficeUseCase,
      private readonly updateResidentialPropertyDetailsUseCase: UpdateResidentialPropertyDetailsUseCase,
      private readonly searchResidentialPropertyByTitleUseCase: SearchResidentialPropertyByTitleUseCase,
      private readonly getExpectedPricePropertyUseCase: GetExpectedPricePropertyUseCase,
    )
    {}

    @Roles('صاحب مكتب')
    @GetOfficePropertiesSwaggerDoc()
    @Get()
    @HttpCode(HttpStatus.OK)
    async getProperties(
      @CurrentUser() user,
      @Req() request: Request,
    ){
      const userId = user.sub;

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      const properties =  await this.getPropertiesForOfficeUseCase.execute(userId,baseUrl);

      return successResponse(properties,'تم ارجاع جميع العقارات الخاصة بمكتبك',200);
    }

    @Roles('صاحب مكتب')
    @Get('/filters')
    @SearchPropertiesSwaggerDoc()
    async searchProertiesWithFilters(
      @Query() filters: SearchPropertiesDto,
      @CurrentUser() user,
      @Req() request: Request,
    ){
      const userId = user.sub;

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      const properties = await this.getPropertiesForOfficeWithFiltersUseCase.execute(userId,filters,baseUrl);

      return successResponse(properties,'تم ارجاع جميع العقارات الخاصة بمكتبك مفلترة',200);

    }

    @Roles('صاحب مكتب')
    @SearchTitlePropertiesSwaggerDoc()
    @Get('/search')
    async seacrhPropertiesByTitle(
      @Query() search: {title: string},
      @CurrentUser() user,
      @Req() request: Request,
    ){
      const userId = user.sub;

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      const properties = await this.searchResidentialPropertyByTitleUseCase.execute(userId,search.title,baseUrl);

      return successResponse(properties,'تم ارجاع جميع العقارات الخاصة المتعقلة بالبحث',200);

    }

    @Roles('صاحب مكتب')
    @GetOfficePropertySwaggerDoc()
    @Get('/properties/:propertyId')
    async getProperty(
      @Param('propertyId') propertyId: number,
      @CurrentUser() user,
      @Req() request: Request,
    ){
      const userId = user.sub;

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      const property = await this.getPropertyForOfficeUseCase.execute(userId,propertyId,baseUrl);

      return successResponse(property,'تم ارجاع العقار بنجاح',200);
    }

    @Roles('صاحب مكتب')
    @GetExpectedPriceSwaggerDoc()
    @Get('/properties/:propertyId/expected-price')
    @HttpCode(HttpStatus.OK)
    async getExpectedPriceForProperty(
      @Param('propertyId',ParseIntPipe) propertyId: number
    ){
      const data = await this.getExpectedPricePropertyUseCase.execute(propertyId);

      return successResponse(data,'تم ارجاع السعر المتوقع للعقار',200);
    }

    @Roles('صاحب مكتب')
    @Post()
    @CreateResidentialPropertySwaggerDoc()
    @HttpCode(HttpStatus.CREATED)
    @PropertyPostImageInterceptor()
    async addResidentialProperty(
        @UploadedFile() file: Express.Multer.File,
        @Body() residentialDetails: CreateResidentialPropertyDto,
        @CurrentUser() user,
    ){
        const userId = user.sub;
        if (!file || !file.filename) {
          throw new BadRequestException(
            errorResponse('يجب رفع صورة للإعلان',400)
          );
        }

        const imageName = file?.filename;

        const propertyId = await this.createResidentialPropertyDetailsUseCase.execute(residentialDetails,userId,imageName);

        const data = {
          id: propertyId,
        }
        return successResponse(data,'تم إضافة العقار بنجاح',201);
    }

    @Roles('صاحب مكتب')
    @Post(':propertyId')
    @HttpCode(HttpStatus.OK)
    @UpdateResidentialPropertySwaggerDoc()
    @PropertyPostImageInterceptor()
    async updateResidentialkProeprty(
      @Param('propertyId') propertyId: number,
      @UploadedFile() file: Express.Multer.File,
      @Body() residentialDetails: UpdateResidentialPropertyDto,
      @CurrentUser() user,
    ){
      const userId = user.sub;

      let imageName: string | undefined = undefined;

      if (file && file.filename) {
        imageName = file.filename;
      }
  
      await this.updateResidentialPropertyDetailsUseCase.execute(
        userId,
        propertyId,
        residentialDetails,
        imageName,
      );
  
      return successResponse([],'تم تحديث تفاصيل العقار بنجاح',200);

    }
}