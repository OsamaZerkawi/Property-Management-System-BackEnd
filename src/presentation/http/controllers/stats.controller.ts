import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GetPopularStatsUseCase } from 'src/application/use-cases/stats/get-popular-stats.use-case';
import { StatsType } from 'src/domain/enums/stats-type.enum';
import { successResponse } from 'src/shared/helpers/response.helper';
import { GetPopularStatsSwaggerDoc } from '../swagger/stats/get-popular-stats.swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import { Role } from 'src/domain/entities/role.entity';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { GetPublicInfoStatsUseCase } from 'src/application/use-cases/stats/get-public-info-status.use-case';
import { GetPublicStatsSwaggerDoc } from '../swagger/stats/get-public-info-stats.swagger';

@Controller('admin/stats')
export class StatsController {
  constructor(
    private readonly getPopularStatsUseCase: GetPopularStatsUseCase,
    private readonly getPublicInfoStatsUseCase: GetPublicInfoStatsUseCase,
  ) {}

  @Roles('مشرف')
  @Permissions('مراقب النظام')
  @GetPublicStatsSwaggerDoc()
  @Get('public-info')
  @HttpCode(HttpStatus.OK)
  async getPublicStats() {
    const result = await this.getPublicInfoStatsUseCase.execute();

    return successResponse(result,'تم إرجاع المعلومات العامة',200);
  }

  @Roles('مشرف')
  @Permissions('مراقب النظام')
  @Get('popular')
  @GetPopularStatsSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async getPopularStats(
    @Req() request: Request,
    @Query('type') type: StatsType,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const result = await this.getPopularStatsUseCase.execute(baseUrl, type);

    return successResponse(
      result,
      'تم إرجاع الرائج من المكاتب أو مزودي الخدمات',
      200,
    );
  }
}
