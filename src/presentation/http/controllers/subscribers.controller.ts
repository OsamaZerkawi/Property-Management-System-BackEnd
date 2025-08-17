import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GetPopularStatsUseCase } from 'src/application/use-cases/stats/get-popular-stats.use-case';
import { StatsType } from 'src/domain/enums/stats-type.enum';
import { Public } from 'src/shared/decorators/public.decorator';
import { GetPopularStatsWithoutLoginSwaggerDoc } from '../swagger/stats/get-popular-stats-without-login.swagger';
import {
  errorResponse,
  successResponse,
} from 'src/shared/helpers/response.helper';
import { RegisterSubscriberDto } from 'src/application/dtos/auth/register-subscriber.dto';
import { ProofDocumenteInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { RegisterSubscriberUseCase } from 'src/application/use-cases/auth/register-subscriber.use-case';
import { ApiRegisterSubscriberSwaggerDoc } from '../swagger/auth/register-subscriber.swagger';

@ApiTags('Subscribers')
@Controller('subscibers')
export class SubscriberController {
  constructor(
    private readonly getPopularStatsUseCase: GetPopularStatsUseCase,
    private readonly registerSubscriberUseCase: RegisterSubscriberUseCase,
  ) {}

  @Public()
  @GetPopularStatsWithoutLoginSwaggerDoc()
  @Get('popular')
  async getPopular(@Req() request: Request, @Query('type') type: StatsType) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const result = await this.getPopularStatsUseCase.execute(baseUrl, type);

    return successResponse(
      result,
      'تم إرجاع الرائج من المكاتب أو مزودي الخدمات',
      200,
    );
  }

  @Public()
  @ProofDocumenteInterceptor()
  @ApiRegisterSubscriberSwaggerDoc()
  @Post('register')
  async registerSubscriber(
    @Body() dto: RegisterSubscriberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(errorResponse('يجب رفع صورة الوثيقة', 400));
    }
    dto.proof_document = file.filename;

    await this.registerSubscriberUseCase.execute(dto);

    return successResponse([], 'تم تسجيل طلبك بنجاح', 201);
  }
}
