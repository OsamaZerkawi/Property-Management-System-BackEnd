import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ServiceProviderFeedbackDto } from 'src/application/dtos/service-provider/service-provider-feedback.dto';
import { ServiceProviderFiltersDto } from 'src/application/dtos/service-provider/service-provider-filters.dto';
import { CreateOrUpdateServiceProviderFeedbackUseCase } from 'src/application/use-cases/service-provider/create-or-update-service-provider-feedback.use-case';
import { GetAllServiceProvidersWithFiltersUseCase } from 'src/application/use-cases/service-provider/get-all-service-provider-with-filters.use-case';
import { GetAllServiceProvidersUseCase } from 'src/application/use-cases/service-provider/get-all-service-provider.use-case';
import { GetServiceProviderDetailsUseCase } from 'src/application/use-cases/service-provider/get-service-provider-details.use-case';
import { GetTopRatedServiceProvidersUseCase } from 'src/application/use-cases/service-provider/get-top-rated-providers.use-case';
import { SearchServiceProviderUseCase } from 'src/application/use-cases/service-provider/search-service-provider.use-case';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from 'src/shared/helpers/response.helper';
import { GetTopRatedServiceProvidersSwaggerDoc } from '../swagger/service-provider/get-top-rated';
import { GetAllServiceProvidersSwaggerDoc } from '../swagger/service-provider/get-all';
import { GetAllServiceProvidersWithFiltersSwaggerDoc } from '../swagger/service-provider/get-all-with-filter';
import { SearchServiceProvidersSwaggerDoc } from '../swagger/service-provider/search-by-name';
import { CreateOrUpdateFeedbackSwaggerDoc } from '../swagger/service-provider/create-or-update-feedback';
import { GetServiceProviderDetailsSwaggerDoc } from '../swagger/service-provider/get-one';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateServiceProviderDto } from 'src/application/dtos/service-provider/update-service-provider.dto';
import { UpdateServiceProviderUseCase } from 'src/application/use-cases/service-provider/update-service-provider.use-case';
import { ServiceProviderLogoInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { UpdateServiceProviderSwagger } from '../swagger/service-provider/update-service-provider.swagger';
import { GetServiceProviderUseCase } from 'src/application/use-cases/service-provider/get-service-provider-details(dashboard).use-case';
import { GetServiceProviderSwagger } from '../swagger/service-provider/get-service-provider.swagger';
@Controller('service-provider')
export class ServiceProviderController {
  constructor(
    private readonly getAllServiceProvidersUseCase: GetAllServiceProvidersUseCase,
    private readonly getAllServiceProviderWithFiltersUseCase: GetAllServiceProvidersWithFiltersUseCase,
    private readonly searchServiceProviderUseCase: SearchServiceProviderUseCase,
    private readonly getTopRatedServiceProvidersUseCase: GetTopRatedServiceProvidersUseCase,
    private readonly createOrUpdateServiceProviderFeedbackUseCase: CreateOrUpdateServiceProviderFeedbackUseCase,
    private readonly getServiceProviderDetailsUseCase: GetServiceProviderDetailsUseCase,
    private readonly updateUseCase: UpdateServiceProviderUseCase,
    private readonly getServiceProviderUseCase: GetServiceProviderUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard) 
  @GetServiceProviderSwagger()
  async getMyServiceProvider(
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data = await this.getServiceProviderUseCase.execute(user.sub, baseUrl);
    return successResponse(data, 'تم جلب بيانات مزود الخدمة بنجاح');
  }

  @Get()
  @GetAllServiceProvidersSwaggerDoc()
  @Public()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Req() request: Request,
    @Query('page') page?: number,
    @Query('items') items?: number,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const { results, total } = await this.getAllServiceProvidersUseCase.execute(
      baseUrl,
      page,
      items,
    );

    if (page && items) {
      return successPaginatedResponse(
        results,
        total,
        page,
        items,
        'تم ارجاع جميع مكاتب مزودي الخدمات',
        200,
      );
    }

    return successResponse(results, 'تم ارجاع جميع مكاتب مزودي الخدمات', 200);
  }

  @Get('filters')
  @GetAllServiceProvidersWithFiltersSwaggerDoc()
  @Public()
  @HttpCode(HttpStatus.OK)
  async getAllWithFilters(
    @Query() filters: ServiceProviderFiltersDto,
    @Req() request: Request,
    @Query('page') page?: number,
    @Query('items') items?: number,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const { results, total } =
      await this.getAllServiceProviderWithFiltersUseCase.execute(
        baseUrl,
        filters,
        page,
        items,
      );

    if (page && items) {
      return successPaginatedResponse(
        results,
        total,
        page,
        items,
        'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة',
        200,
      );
    }

    return successResponse(
      results,
      'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة',
      200,
    );
  }

  @Get('search')
  @SearchServiceProvidersSwaggerDoc()
  @Public()
  @HttpCode(HttpStatus.OK)
  async search(
    @Query('name') name: string,
    @Req() request: Request,
    @Query('page') page?: number,
    @Query('items') items?: number,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const { results, total } = await this.searchServiceProviderUseCase.execute(
      name,
      baseUrl,
      page,
      items,
    );

    if (page && items) {
      return successPaginatedResponse(
        results,
        total,
        page,
        items,
        'تم ارجاع جميع مكاتب مزودي الخدمات',
        200,
      );
    }

    return successResponse(results, 'تم ارجاع جميع مكاتب مزودي الخدمات', 200);
  }

  @Get('top-rated')
  @GetTopRatedServiceProvidersSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  @Public()
  async getTopRatedServiceProviders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const [data, total] = await this.getTopRatedServiceProvidersUseCase.execute(
      page,
      items,
      baseUrl,
    );

    return successPaginatedResponse(
      data,
      total,
      page,
      items,
      'تم جلب مقدمي الخدمات بنجاح',
      200,
    );
  }

  @Get(':id')
  @Public()
  @GetServiceProviderDetailsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getDetails(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data = await this.getServiceProviderDetailsUseCase.execute(
      id,
      baseUrl,
    );
    if (!data) {
      throw new NotFoundException(
        errorResponse('لا يوجد مزود خدمات لهذا المعرف', 404),
      );
    }
    return successResponse(data, 'تم إرجاع تفاصيل مزود الخدمة', 200);
  }

  @Post(':id/feedback')
  @CreateOrUpdateFeedbackSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdateFeedack(
    @Param('id') serviceProviderId: number,
    @Body() data: ServiceProviderFeedbackDto,
    @CurrentUser() user,
  ) {
    const userId = user.sub;

    const feedback =
      await this.createOrUpdateServiceProviderFeedbackUseCase.execute(
        userId,
        serviceProviderId,
        data,
      );

    return successResponse([], 'تم التقييم او تقديم شكوى بنجاح', 201);
  }
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UpdateServiceProviderSwagger()
  @ServiceProviderLogoInterceptor() 
  async update(
    @CurrentUser() user,
    @Body() dto: UpdateServiceProviderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = user.sub;
    if (file?.filename) dto.logo = file.filename;

    await this.updateUseCase.execute(userId, dto);
  
    return successResponse([], 'تم تحديث بيانات مزود الخدمة بنجاح', HttpStatus.OK);
  } 
  
 
}
