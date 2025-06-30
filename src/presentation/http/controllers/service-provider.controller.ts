import { Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";
import { GetAllServiceProvidersWithFiltersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider-with-filters.use-case";
import { GetAllServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider.use-case";
import { GetTopRatedServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-top-rated-providers.use-case";
import { SearchServiceProviderUseCase } from "src/application/use-cases/service-provider/search-service-provider.use-case";
import { Public } from "src/shared/decorators/public.decorator";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
@Controller('service-provider')
export class ServiceProviderController{
    constructor(
        private readonly getAllServiceProvidersUseCase: GetAllServiceProvidersUseCase,
        private readonly getAllServiceProviderWithFiltersUseCase: GetAllServiceProvidersWithFiltersUseCase,
        private readonly searchServiceProviderUseCase: SearchServiceProviderUseCase,
        private readonly getTopRatedServiceProvidersUseCase: GetTopRatedServiceProvidersUseCase,
    ){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(){
        const data = await this.getAllServiceProvidersUseCase.execute();

        return successResponse(data,'تم ارجاع جميع مكاتب مزودي الخدمات',200);
    }

    @Get('filters')
    @HttpCode(HttpStatus.OK)
    async getAllWithFilters(
        @Query() filters: ServiceProviderFiltersDto
    ){
        const data = await this.getAllServiceProviderWithFiltersUseCase.execute(filters);

        return successResponse(data,'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة',200);
    }

    @Get('search')
    @HttpCode(HttpStatus.OK)
    async search(
        @Query('name') name: string,
    ){
        const data = await this.searchServiceProviderUseCase.execute(name);

        return successResponse(data,'تم ارجاع جميع مكاتب مزودي الخدمات ',200);
    }

    @Get('top-rated')
    @HttpCode(HttpStatus.OK)
    @Public()
    async getTopRatedServiceProviders(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const [data,total] = await this.getTopRatedServiceProvidersUseCase.execute(page,items,baseUrl);

        return successPaginatedResponse(data,total,page,items,'تم جلب مقدمي الخدمات بنجاح',200);
    }
}