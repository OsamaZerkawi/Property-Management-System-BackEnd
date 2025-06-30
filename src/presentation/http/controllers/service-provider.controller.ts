import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { ServiceProviderFeedbackDto } from "src/application/dtos/service-provider/service-provider-feedback.dto";
import { ServiceProviderFiltersDto } from "src/application/dtos/service-provider/service-provider-filters.dto";
import { CreateOrUpdateServiceProviderFeedbackUseCase } from "src/application/use-cases/service-provider/create-or-update-service-provider-feedback.use-case";
import { GetAllServiceProvidersWithFiltersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider-with-filters.use-case";
import { GetAllServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider.use-case";
import { GetTopRatedServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-top-rated-providers.use-case";
import { SearchServiceProviderUseCase } from "src/application/use-cases/service-provider/search-service-provider.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
@Controller('service-provider')
export class ServiceProviderController{
    constructor(
        private readonly getAllServiceProvidersUseCase: GetAllServiceProvidersUseCase,
        private readonly getAllServiceProviderWithFiltersUseCase: GetAllServiceProvidersWithFiltersUseCase,
        private readonly searchServiceProviderUseCase: SearchServiceProviderUseCase,
        private readonly getTopRatedServiceProvidersUseCase: GetTopRatedServiceProvidersUseCase,
        private readonly createOrUpdateServiceProviderFeedbackUseCase: CreateOrUpdateServiceProviderFeedbackUseCase,
    ){}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    async getAll(
      @Req() request: Request,
      @Query('page') page?: number,
      @Query('items') items?: number,
    ) {
      const baseUrl = `${request.protocol}://${request.get('host')}`;    

      const { results, total } = await this.getAllServiceProvidersUseCase.execute(baseUrl, page, items);    

      if (page && items) {
        return successPaginatedResponse(results, total, page, items, 'تم ارجاع جميع مكاتب مزودي الخدمات', 200);
      }    

      return successResponse(results, 'تم ارجاع جميع مكاتب مزودي الخدمات', 200);
    }    

    @Get('filters')
    @Public()
    @HttpCode(HttpStatus.OK)
    async getAllWithFilters(
      @Query() filters: ServiceProviderFiltersDto,
      @Req() request: Request,
      @Query('page') page?: number,
      @Query('items') items?: number,
    ) {
      const baseUrl = `${request.protocol}://${request.get('host')}`;    

      const { results, total } = await this.getAllServiceProviderWithFiltersUseCase.execute(baseUrl, filters, page, items);    

      if (page && items) {
        return successPaginatedResponse(results, total, page, items, 'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة', 200);
      }    

      return successResponse(results, 'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة', 200);
    }    

    @Get('search')
    @Public()
    @HttpCode(HttpStatus.OK)
    async search(
      @Query('name') name: string,
      @Req() request: Request,
      @Query('page') page?: number,
      @Query('items') items?: number,
    ) {
      const baseUrl = `${request.protocol}://${request.get('host')}`;    

      const { results, total } = await this.searchServiceProviderUseCase.execute(name, baseUrl, page, items);    

      if (page && items) {
        return successPaginatedResponse(results, total, page, items, 'تم ارجاع جميع مكاتب مزودي الخدمات', 200);
      }    

      return successResponse(results, 'تم ارجاع جميع مكاتب مزودي الخدمات', 200);
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

    @Post(':id/feedback')
    @HttpCode(HttpStatus.CREATED)
    async createOrUpdateFeedack(
        @Param('id') serviceProviderId: number,
        @Body() data: ServiceProviderFeedbackDto,
        @CurrentUser() user,
    ){
        const userId = user.sub;

        const feedback = await this.createOrUpdateServiceProviderFeedbackUseCase.execute(userId,serviceProviderId,data);

        return successResponse([],'تم التقييم او تقديم شكوى بنجاح',201);
    }
}