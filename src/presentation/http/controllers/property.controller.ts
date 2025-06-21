import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { userInfo } from "os";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { FindPropertyDetailsByIdUseCase } from "src/application/use-cases/property/find-property-details-by-id.use-case";
import { GetAllPropertiesWithFiltersUseCase } from "src/application/use-cases/property/get-all-properties-with-filters.use-case";
import { GetAllPropertiesUseCase } from "src/application/use-cases/property/get-all-properties.use-case";
import { SearchPropertiesByTitleUseCase } from "src/application/use-cases/property/search-properties-by-title.use-case";
import { SearchPropertyWithAdvancedFiltersUseCase } from "src/application/use-cases/property/search-property-with-advanced-filter.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";

@Controller('properties')
export class PropertyController{
    constructor(
        private readonly getAllPropertiesUseCase: GetAllPropertiesUseCase,
        private readonly getAllPropertiesWithFiltersUseCase: GetAllPropertiesWithFiltersUseCase,
        private readonly searchPropertiesByTitleUseCase: SearchPropertiesByTitleUseCase,
        private readonly searchPropertyWithAdvancedFiltersUseCase: SearchPropertyWithAdvancedFiltersUseCase,
        private readonly findPropertyDetailsByIdUseCase: FindPropertyDetailsByIdUseCase,
    ){}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    async getProperties(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Req() request: Request,    
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const [properties,total] = await this.getAllPropertiesUseCase.execute(baseUrl,page,items);

        return successPaginatedResponse(properties, total, page, items,'تم ارجاع جميع العقارات',200);
    }

    @Get(':propertyId')
    @Public()
    @HttpCode(HttpStatus.OK)
    async getProperty(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const property = await this.findPropertyDetailsByIdUseCase.execute(propertyId,baseUrl);

        return successResponse(property,'تم ارجاع تفاصيل العقار',200);
    }

    @Get('filters') 
    @Public()
    @HttpCode(HttpStatus.OK)
    async getPropetiesWithFilters(
        @Query() filters: PropertiesFiltersDto,
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Req() request: Request
    ){

         console.log(filters.tags);
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const [properties, total] = await this.getAllPropertiesWithFiltersUseCase.execute(baseUrl, filters, page, items);

        return successPaginatedResponse(properties, total, page, items, 'تم إرجاع العقارات المفلترة بنجاح', 200);
    }

    @Get('search')
    @Public()
    @HttpCode(HttpStatus.OK)
    async search(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Query('title') title: string,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const [properties, total] = await this.searchPropertiesByTitleUseCase.execute(title,baseUrl,page,items);

        return successPaginatedResponse(properties, total, page, items,'تمت عملية البحث بنجاح',200);
    }

    @Post('search/filters')
    @Public()
    @HttpCode(HttpStatus.OK)
    async searchWithFilters(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Body() filters: ResidentialPropertiesSearchFiltersDto,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const [data,total] = await this.searchPropertyWithAdvancedFiltersUseCase.execute(baseUrl,filters,page,items);

        return successPaginatedResponse(data,total,page,items,'تم جلب العقارات بنجاح.',200);
    }
}