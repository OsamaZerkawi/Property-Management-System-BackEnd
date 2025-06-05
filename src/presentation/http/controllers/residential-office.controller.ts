import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UploadedFile, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CreateResidentialPropertyDto } from "src/application/dtos/property/createResidentialProperty.dto";
import { SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { CreateResidentialPropertyDetailsUseCase } from "src/application/use-cases/property/create-residential-property-details.use-case";
import { GetPropertiesForOfficeWithFiltersUseCase } from "src/application/use-cases/property/get-properties-for-office-with-filters.use-case";
import { GetPropertiesForOfficeUseCase } from "src/application/use-cases/property/get-properties-for-office.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";
import { PropertyImageInterceptor, PropertyPostImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";

@Controller('residential-office')
export class ResidentialOfficeController {
    constructor(
      private readonly createResidentialPropertyDetailsUseCase: CreateResidentialPropertyDetailsUseCase,
      private readonly getPropertiesForOfficeUseCase: GetPropertiesForOfficeUseCase,
      private readonly getPropertiesForOfficeWithFiltersUseCase: GetPropertiesForOfficeWithFiltersUseCase,
    )
    {}

    @Get()
    @UseGuards(JwtAuthGuard)
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

    @Get('/search')
    @UseGuards(JwtAuthGuard)
    async searchProerties(
      @Query() filters: SearchPropertiesDto,
      @CurrentUser() user,
      @Req() request: Request,
    ){
      const userId = user.sub;

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      const properties = await this.getPropertiesForOfficeWithFiltersUseCase.execute(userId,filters,baseUrl);

      return successResponse(properties,'تم ارجاع جميع العقارات الخاصة بمكتبك مفلترة',200);

    }

    @Post()
    @UseGuards(JwtAuthGuard)
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

        const residentialPropert = await this.createResidentialPropertyDetailsUseCase.execute(residentialDetails,userId,imageName);

        return successResponse(residentialPropert,'تم إضافة العقار بنجاح',201);
    }
}