import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";
import { GetAllServiceProvidersWithFiltersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider-with-filters.use-case";
import { GetAllServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider.use-case";
import { SearchServiceProviderUseCase } from "src/application/use-cases/service-provider/search-service-provider.use-case";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('service-provider')
export class ServiceProviderController{
    constructor(
        private readonly getAllServiceProvidersUseCase: GetAllServiceProvidersUseCase,
        private readonly getAllServiceProviderWithFiltersUseCase: GetAllServiceProvidersWithFiltersUseCase,
        private readonly searchServiceProviderUseCase: SearchServiceProviderUseCase,
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAll(){
        const data = await this.getAllServiceProvidersUseCase.execute();

        return successResponse(data,'تم ارجاع جميع مكاتب مزودي الخدمات',200);
    }

    @Get('filters')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAllWithFilters(
        @Query() filters: ServiceProviderFiltersDto
    ){
        const data = await this.getAllServiceProviderWithFiltersUseCase.execute(filters);

        return successResponse(data,'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة',200);
    }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async search(
        @Query('name') name: string,
    ){
        const data = await this.searchServiceProviderUseCase.execute(name);

        return successResponse(data,'تم ارجاع جميع مكاتب مزودي الخدمات ',200);
    }
}