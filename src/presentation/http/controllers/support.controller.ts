import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFaqDto } from 'src/application/dtos/support/create-faq.dto';
import { CreateFaqUseCase } from 'src/application/use-cases/support/create-faq.use-case';
import { successResponse } from 'src/shared/helpers/response.helper';
import { ApiCreateFaq } from '../swagger/support/create-faq.swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdateFaqUseCase } from 'src/application/use-cases/support/update-faq.use-case';
import { UpdateFaqDto } from 'src/application/dtos/support/update-faq.dto';
import { ApiUpdateFaq } from '../swagger/support/update-faq.swagger';
import { DeleteFaqUseCase } from 'src/application/use-cases/support/delete-faq.use-case';
import { ApiDeleteFaq } from '../swagger/support/delete-faq.swagger';
import { FindAllFaqsUseCase } from 'src/application/use-cases/support/get-all-faqs.use-case';
import { ApiGetAllFaqs } from '../swagger/support/get-all-faqs.swagger';

@ApiTags('Support')
@Controller('admin/supports')
export class SupportController {
  constructor(
    private readonly createFaqUseCase: CreateFaqUseCase,
    private readonly updateFaqUseCase: UpdateFaqUseCase,
    private readonly deleteFaqUseCase: DeleteFaqUseCase,
    private readonly findAllFaqsUseCase: FindAllFaqsUseCase,
  ) {}

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiGetAllFaqs()
  @Get('faqs')
  @HttpCode(HttpStatus.OK)
  async getAllFaqs() {
    const faqs = await this.findAllFaqsUseCase.execute();

    return successResponse(faqs, 'تم جلب قائمة الأسئلة بنجاح', 200);
  }

  @Roles('مزود خدمة') 
  @ApiGetAllFaqs()
  @Get('Pfaqs')
  @HttpCode(HttpStatus.OK)
  async getAllFaqsForProvider() {
  const faqs = await this.findAllFaqsUseCase.execute();

    return successResponse(faqs, 'تم جلب قائمة الأسئلة بنجاح', 200);
  }
  
  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiCreateFaq()
  @Post('faqs')
  @HttpCode(HttpStatus.CREATED)
  async createFaq(@Body() dto: CreateFaqDto) {
    await this.createFaqUseCase.execute(dto);

    return successResponse([], 'تم إضافة السؤال بنجاح', 201);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiUpdateFaq()
  @Put('faqs/:id')
  @HttpCode(HttpStatus.OK)
  async updateFaq(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFaqDto,
  ) {
    await this.updateFaqUseCase.execute(id, dto);

    return successResponse([], 'تم تعديل السؤال بنجاح', 200);
  }

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiDeleteFaq()
  @Delete('faqs/:id')
  @HttpCode(HttpStatus.OK)
  async deleteFaq(@Param('id', ParseIntPipe) id: number) {
    await this.deleteFaqUseCase.execute(id);

    return successResponse([], 'تم حذف السؤال بنجاح', 200);
  }
}
