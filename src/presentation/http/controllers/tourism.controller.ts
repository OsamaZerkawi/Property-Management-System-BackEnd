import { Controller, Post, Get, Put, Param, Body, UseGuards, BadRequestException ,Query, Req, UploadedFile} from '@nestjs/common';
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
import { errorResponse, successResponse } from 'src/shared/helpers/response.helper';
import { CreateTourismSwaggerDoc } from '../swagger/tourism_places/create-tourism-property.swagger';
import { UpdateTourismSwaggerDoc } from '../swagger/tourism_places/update-tourism-property.swagger';
import { ListTourismSwaggerDoc } from '../swagger/tourism_places/list-tourism-property.swagger';
import { FilterTourismSwaggerDoc } from '../swagger/tourism_places/filter-tourism-property.swagger';
import { ShowTourismSwaggerDoc } from '../swagger/tourism_places/show-tourism-property.swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { PropertyPostImageInterceptor } from 'src/shared/interceptors/file-upload.interceptor';

@Controller('tourism')
export class TourismController {
  constructor(
    private readonly createTourism: CreateTourismUseCase,
    private readonly updateTourism: UpdateTourismUseCase,
    private readonly listTourism: ListTourismUseCase,
    private readonly filterTourism: FilterTourismUseCase, 
    private readonly searchByTitleUseCase: SearchByTitleUseCase,
    private readonly showTourismUseCase: ShowTourismUseCase
  ) {}

  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @CreateTourismSwaggerDoc()
  @PropertyPostImageInterceptor()
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() body: any,
  ) { 
    const dto = new CreateTourismDto();

    if (!file || !file.filename) {
      throw new BadRequestException(
        errorResponse('يجب رفع صورة للإعلان',400)
      );
    }

    const imageUrl = file?.filename;
    dto.image = imageUrl;

    Object.assign(dto, body.post, body.public_information, body.tourism_place);
    await this.createTourism.execute(user.sub, dto);
    return successResponse([],'تم اضافة المكان بنجاح');
  }
 
  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @UpdateTourismSwaggerDoc()
  @PropertyPostImageInterceptor()
  @Post(':id')
  async update(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() dto: UpdateTourismDto
  ) { 
    
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('لا توجد بيانات للتحديث');
    }
    
    if (!file || !file.filename) {
      throw new BadRequestException(
        errorResponse('يجب رفع صورة للإعلان',400)
      );
    }

    const imageUrl = file?.filename;
    dto.image = imageUrl;

    await this.updateTourism.execute(user.sub, +id, dto);
    return successResponse([],'تم تعديل العقار السياحي بنجاح');
  }

  //@Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ListTourismSwaggerDoc()
  async list(@CurrentUser() user: any,@Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data= await this.listTourism.execute(user.sub,baseUrl);
    return successResponse(data,'تم ارجاع العقارات السياحية بنجاح');
  }

  @Roles('صاحب مكتب')
  @UseGuards(JwtAuthGuard)
  @FilterTourismSwaggerDoc()
  @Get('filter')
  async filter(
    @CurrentUser() user: any,
    @Query() filterDto: FilterTourismDto,
    @Req() request: Request
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const data= await this.filterTourism.execute(user.sub, filterDto,baseUrl);
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
}
