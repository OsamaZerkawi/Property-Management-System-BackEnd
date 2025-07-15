import { Controller, Post, Get, Put, Param, Body, UseGuards, BadRequestException ,Query} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { CreateTourismDto } from '../../../application/dtos/tourism/create-tourism.dto';
import { FilterTourismDto } from '../../../application/dtos/tourism/filter-tourism.dto';
import { UpdateTourismDto } from '../../../application/dtos/tourism/update-tourism.dto';
import { CreateTourismUseCase } from '../../../application/use-cases/tourism/create-tourism.use-case';
import { UpdateTourismUseCase } from 'src/application/use-cases/tourism/update-tourism.use-case';
import { FilterTourismUseCase } from 'src/application/use-cases/tourism/filter-tourism.use-case';

import { ListTourismUseCase } from 'src/application/use-cases/tourism/list-tourism.use-case';

@Controller('tourism')
export class TourismController {
  constructor(
    private readonly createTourism: CreateTourismUseCase,
    private readonly updateTourism: UpdateTourismUseCase,
    private readonly listTourism: ListTourismUseCase,
    private readonly filterTourism: FilterTourismUseCase, 
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) { 
    const dto = new CreateTourismDto();
    Object.assign(dto, body.post, body.public_information, body.tourism_place);
    return this.createTourism.execute(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    const dto = new UpdateTourismDto();
    Object.assign(dto, body.post, body.public_information, body.tourism_place);
    return this.updateTourism.execute(user.sub, +id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@CurrentUser() user: any) {
    return this.listTourism.execute(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  async filter(
    @CurrentUser() user: any,
    @Query() filterDto: FilterTourismDto,
  ) {
    return this.filterTourism.execute(user.sub, filterDto);
  }
}
