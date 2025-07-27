import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { CompareTwoPropertiesUseCase } from "src/application/use-cases/property/compare-two-properties.use-case";
import { FindPropertyDetailsByIdUseCase } from "src/application/use-cases/property/find-property-details-by-id.use-case";
import { FindRelatedPropertiesUseCase } from "src/application/use-cases/property/find-related-properties.use-case";
import { GetAllPropertiesWithFiltersUseCase } from "src/application/use-cases/property/get-all-properties-with-filters.use-case";
import { GetAllPropertiesUseCase } from "src/application/use-cases/property/get-all-properties.use-case";
import { RatePropertyUseCase } from "src/application/use-cases/property/rate-property.use-case";
import { SearchPropertiesByTitleUseCase } from "src/application/use-cases/property/search-properties-by-title.use-case";
import { SearchPropertyWithAdvancedFiltersUseCase } from "src/application/use-cases/property/search-property-with-advanced-filter.use-case";
import { FindTopRatedPropertiesUseCase } from "src/application/use-cases/residential/find-top-rated-residential-properties.use-case";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
import { GetTopRatedPropertiesSwaggerDoc } from "../swagger/property/get-top-rated";
import { GetAllPropertiesSwaggerDoc } from "../swagger/property/get-all.swagger";
import { GetFilteredPropertiesSwaggerDoc } from "../swagger/property/get-all-with-filter.swagger";
import { SearchPropertiesSwaggerDoc } from "../swagger/property/search-by-title.swagger";
import { SearchPropertiesWithFiltersSwaggerDoc } from "../swagger/property/search-with-filters.swagger";
import { GetPropertyDetailsSwaggerDoc } from "../swagger/property/get-property-details.swagger";
import { GetRelatedPropertiesSwaggerDoc } from "../swagger/property/get-related-properties.swagger";
import { RatePropertySwaggerDoc } from "../swagger/property/rate-property.swagger";
import { CompareTwoPropertiesSwaggerDoc } from "../swagger/property/compare-two-proerties.swagger";
import { userInfo } from "os";
import { GetPromotedPropertiesUseCase } from "src/application/use-cases/property/get-promoted-properties.use-case";
import { use } from "passport";
import { GetPromotedPropertiesSwaggerDoc } from "../swagger/property/get-promoted-properties.swagger";


@Controller('properties')
export class PropertyController{
    constructor(
        private readonly getAllPropertiesUseCase: GetAllPropertiesUseCase,
        private readonly getAllPropertiesWithFiltersUseCase: GetAllPropertiesWithFiltersUseCase,
        private readonly searchPropertiesByTitleUseCase: SearchPropertiesByTitleUseCase,
        private readonly searchPropertyWithAdvancedFiltersUseCase: SearchPropertyWithAdvancedFiltersUseCase,
        private readonly findPropertyDetailsByIdUseCase: FindPropertyDetailsByIdUseCase,
        private readonly findRelatedPropertiesUseCase: FindRelatedPropertiesUseCase,
        private readonly ratePropertyUseCase: RatePropertyUseCase,
        private readonly compareTwoPropertiesUseCase: CompareTwoPropertiesUseCase,
        private readonly findTopRatedPropertiesUseCase: FindTopRatedPropertiesUseCase,
        private readonly getPromotedPropertiesUseCase: GetPromotedPropertiesUseCase,
    ){}

    @Get('top-rated')
    @GetTopRatedPropertiesSwaggerDoc()
    @Public()
    @HttpCode(HttpStatus.OK)
    async getTopRatedProerties(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,        
        @Query('type') type: PropertyType,
        @Req() request: Request,
    ){
        const userId = (request.user as any)?.sub ?? null;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const {results,total} = await this.findTopRatedPropertiesUseCase.execute(page,items,type,baseUrl,userId);

        return successPaginatedResponse(results,total,page,items,'تم إرجاع جميع العقارات المميزة',200);
    }

    @Get('promoted')
    @Public()
    @GetPromotedPropertiesSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getPromotedProperties(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number, 
        @Req() request: Request        
    ){
        const userId = (request.user as any)?.sub ?? null;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const { results , total} = await this.getPromotedPropertiesUseCase.execute(page,items,userId,baseUrl);

        return successPaginatedResponse(results,total,page,items,'تم إرجاع جميع العقارات المروجة',200);

    }

    @Get('search')
    @SearchPropertiesSwaggerDoc()
    @Public()
    @HttpCode(HttpStatus.OK)
    async search(
        @Query('page', new DefaultValuePipe(1)) page: any,
        @Query('items', new DefaultValuePipe(10)) items: any,
        @Query('title') title: any,
        @Req() request: Request
    ){
        const userId = (request.user as any)?.sub ?? null;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const [properties, total] = await this.searchPropertiesByTitleUseCase.execute(title,baseUrl,page,items,userId);

        return successPaginatedResponse(properties, total, page, items,'تمت عملية البحث بنجاح',200);
    }

    @Get('filters')
    @GetFilteredPropertiesSwaggerDoc() 
    @Public()
    @HttpCode(HttpStatus.OK)
    async getPropetiesWithFilters(
        @Query() filters: PropertiesFiltersDto,
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Req() request: Request
    ){
        const userId = (request.user as any)?.sub ?? null;
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const [properties, total] = await this.getAllPropertiesWithFiltersUseCase.execute(baseUrl, filters, page, items,userId);

        return successPaginatedResponse(properties, total, page, items, 'تم إرجاع العقارات المفلترة بنجاح', 200);
    }

    @Get()
    @GetAllPropertiesSwaggerDoc()
    @Public()
    @HttpCode(HttpStatus.OK)
    async getProperties(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Req() request: Request,    
    ){
        const userId = (request.user as any)?.sub ?? null;

        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const [properties,total] = await this.getAllPropertiesUseCase.execute(baseUrl,page,items,userId);

        // return properties;
        return successPaginatedResponse(properties, total, page, items,'تم ارجاع جميع العقارات',200);
    }

    @Get('compare')
    @CompareTwoPropertiesSwaggerDoc()
    @Public()
    @HttpCode(HttpStatus.OK)
    async compareTwo(
        @Query('id1',ParseIntPipe) id1: number,
        @Query('id2',ParseIntPipe) id2: number,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const userId = (request.user as any)?.sub ?? null;

        const data = await this.compareTwoPropertiesUseCase.execute(id1,id2,userId,baseUrl);

        return successResponse(data,'تم المقارنة بين العقارين بنجاح',200);
    }

    @Get(':propertyId')
    @GetPropertyDetailsSwaggerDoc()
    @Public()
    @HttpCode(HttpStatus.OK)
    async getProperty(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const userId = (request.user as any)?.sub ?? null;

        const property = await this.findPropertyDetailsByIdUseCase.execute(propertyId,baseUrl,userId);

        return successResponse(property,'تم ارجاع تفاصيل العقار',200);
    }

    @Post('search/filters')
    @SearchPropertiesWithFiltersSwaggerDoc()
    @Public()
    @HttpCode(HttpStatus.OK)
    async searchWithFilters(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Body() filters: ResidentialPropertiesSearchFiltersDto,
        @Req() request: Request,
    ){
        const userId = (request.user as any)?.sub ?? null;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const [data,total] = await this.searchPropertyWithAdvancedFiltersUseCase.execute(baseUrl,filters,page,items,userId);

        return successPaginatedResponse(data,total,page,items,'تم جلب العقارات بنجاح.',200);
    }

    @Post(':propertyId/rate')
    @RatePropertySwaggerDoc()   
    @HttpCode(HttpStatus.OK)
    async rateProperty(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @Body('rate') rate: number,
        @CurrentUser() user,
    ){
        const userId = user.sub;

        console.log(rate);
        await this.ratePropertyUseCase.execute(userId,propertyId,rate);

        return successResponse([],'تم تقييم العقار بنجاح',200);
    }

    @Get(':propertyId/related')
    @GetRelatedPropertiesSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    @Public()
    async getRelatedProperteis(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const properties = await this.findRelatedPropertiesUseCase.execute(propertyId,baseUrl);

        return successResponse(properties,'تم ارجاع العقارات ذات صلة',200);
    }


}