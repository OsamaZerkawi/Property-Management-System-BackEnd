import { Controller, Post, Get, Put, Param, Body, UseGuards, BadRequestException ,Query, Req, DefaultValuePipe, ParseIntPipe} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { CreateTourismDto } from '../../../application/dtos/tourism/create-tourism.dto';
import { FilterTourismDto } from '../../../application/dtos/tourism/filter-tourism.dto';
import { UpdateTourismDto } from '../../../application/dtos/tourism/update-tourism.dto';
import { CreateTourismUseCase } from '../../../application/use-cases/tourism/create-tourism.use-case';
import { UpdateTourismUseCase } from 'src/application/use-cases/tourism/update-tourism.use-case';
import { FilterTourismUseCase } from 'src/application/use-cases/tourism/filter-tourism.use-case';
import { Request } from 'express';
import { ListTourismUseCase } from 'src/application/use-cases/tourism/list-tourism.use-case';
import { SearchByTitleUseCase } from 'src/application/use-cases/tourism/search-by-title.use-case';
import { ShowTourismUseCase } from 'src/application/use-cases/tourism/show-tourism.use-case';
import { successPaginatedResponse, successResponse } from 'src/shared/helpers/response.helper';
import { CreateTourismSwaggerDoc } from '../swagger/tourism_places/create-tourism-property.swagger';
import { UpdateTourismSwaggerDoc } from '../swagger/tourism_places/update-tourism-property.swagger';
import { ListTourismSwaggerDoc } from '../swagger/tourism_places/list-tourism-property.swagger';
import { FilterTourismSwaggerDoc } from '../swagger/tourism_places/filter-tourism-property.swagger';
import { ShowTourismSwaggerDoc } from '../swagger/tourism_places/show-tourism-property.swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { FilterTourismPropertiesUseCase, PropertyResponse } from 'src/application/use-cases/tourism-mobile/filter-tourim-property.use-case';
import { FilterTourismPropertiesDto } from 'src/application/dtos/tourism-mobile/filter-tourism-properties.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { FilterMobileTourismSwaggerDoc } from '../swagger/tourism_places/filter-mobile-tourism-property.swagger';
import { SearchTourismUseCase } from 'src/application/use-cases/tourism-mobile/search-tourism-property.use-case';
import { SearchByTitleSwaggerDoc } from '../swagger/tourism_places/search-by-title-swagger';
import { ShowTourismMobileUseCase } from 'src/application/use-cases/tourism/show-tourism-mobile.use-case';
import { ShowMobileTourismSwaggerDoc } from '../swagger/tourism_places/show-mobile-tourism-property.swagger';
import { GetTourismFinanceByYearUseCase } from 'src/application/use-cases/tourism/get-finance-tourism-by-year.use-case';
import { ShowTourismFinanceByYearSwaggerDoc } from '../swagger/tourism_places/get-tourism-property-invoices.swagger';

@Controller('tourism')
export class TourismController {
  constructor(
    private readonly createTourism: CreateTourismUseCase,
    private readonly updateTourism: UpdateTourismUseCase,
    private readonly listTourism: ListTourismUseCase,
    private readonly filterTourism: FilterTourismUseCase, 
    private readonly searchByTitleUseCase: SearchByTitleUseCase,
    private readonly showTourismUseCase: ShowTourismUseCase,
    private readonly showTourismMobileUseCase: ShowTourismMobileUseCase,
    private readonly filterTourismPropertiesUseCase: FilterTourismPropertiesUseCase,
    private readonly searchTourismUseCase :SearchTourismUseCase,
    private readonly getTourismFinanceByYearUseCase: GetTourismFinanceByYearUseCase
  ) {}

  @Get('mobile')
  @FilterMobileTourismSwaggerDoc()
  @Public()
  async index(
    @Query() query: FilterTourismPropertiesDto,
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
    @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
     @Req() request: Request
  )  {
            const baseUrl = `${request.protocol}://${request.get('host')}`;

 const { data: results, total } =
    await this.filterTourismPropertiesUseCase.execute(query, page, items,baseUrl);
 
    return successPaginatedResponse<PropertyResponse[]>(
      results,           
      total,           
      page,              
      items,           
      'تم ارجاع العقارات السياحية بنجاح', 
      200              
    );
  }

  @Get('mobile/search') 
  @SearchByTitleSwaggerDoc()
  @Public()
  async searchTourismByTitle(
    @Query('title') search: string,
    @Query('page') page = 1,
    @Query('items') items = 10 ,
    @Req() request: Request
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    return this.searchTourismUseCase.execute(search, page, items,baseUrl);
  }


  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @CreateTourismSwaggerDoc()
  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) { 
    const dto = new CreateTourismDto();
    Object.assign(dto, body.post, body.public_information, body.tourism_place);
    await this.createTourism.execute(user.sub, dto);
    return successResponse([],'تم اضافة المكان بنجاح');
  }
 
  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @UpdateTourismSwaggerDoc()
  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() dto: UpdateTourismDto
  ) { 
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('لا توجد بيانات للتحديث');
    }
    await this.updateTourism.execute(user.sub, +id, dto);
    return successResponse([],'تم تعديل العقار السياحي بنجاح');
  }

  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ListTourismSwaggerDoc()
  async list(@CurrentUser() user: any) {
    const data= this.listTourism.execute(user.sub);
    return successResponse(data,'تم ارجاع العقارات السياحية بنجاح');
  }

  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @FilterTourismSwaggerDoc()
  @Get('filter')
  async filter(
    @CurrentUser() user: any,
    @Query() filterDto: FilterTourismDto,
  ) {
    const data= this.filterTourism.execute(user.sub, filterDto);
    return successResponse(data,'تم ارجاع العقارات السياحية بنجاح');
  }
  
  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchByTitle(
    @CurrentUser() user: any,
      @Query('title') title: string,
    ) {
    return this.searchByTitleUseCase.execute(user.sub, title);
  }

  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ShowTourismSwaggerDoc()
  async getPropertyDetails(
  @CurrentUser() user: any,
    @Param('id') propertyId: number,
     @Req() request: Request
  ) {
     const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data=await this.showTourismUseCase.execute(user.sub, propertyId,baseUrl);
    return successResponse(data,'تم ارجاع تفاصيل العقار السياحي بنجاح');
  }

  @Public()
  @Get('mobile/:id')
  @ShowMobileTourismSwaggerDoc()
  async gettourismPropertyDetails( 
    @Param('id') propertyId: number,
     @Req() request: Request
  ) {
     const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data=await this.showTourismMobileUseCase.execute(propertyId,baseUrl);
    return successResponse(data,'تم ارجاع تفاصيل العقار السياحي بنجاح');
  }

  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @ShowTourismFinanceByYearSwaggerDoc()
  @Get('mobile/:id/year/:year') 
  async getFinanceByYear(
    @Param('id')   propertyId: number,
    @Param('year') year: number,
    @Req() request: Request,
    @CurrentUser() user:any,

  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data = await this.getTourismFinanceByYearUseCase.execute(propertyId, year,user.sub,baseUrl);
    return successResponse(data, 'تم إرجاع السجلات المالية لكل شهر بنجاح');
  }
}
