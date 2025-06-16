// src/presentation/http/controllers/office.controller.ts
import {
    Controller, Get, Post, Body,
    HttpCode, HttpStatus, UseGuards
  } from "@nestjs/common";
  import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
  import { CreateOfficeUseCase } from "src/application/use-cases/office/create-office.usecase";
  import { CurrentUser } from "src/shared/decorators/current-user.decorator";
  import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
  import { successResponse } from "src/shared/helpers/response.helper";
  import { CreateOfficeDto } from "src/application/dtos/office/create-office.dto";
  
  @Controller('office')
  export class OfficeController {
    constructor(
      private readonly getCommissionOfOfficeUseCase: GetCommissionOfOfficeUseCase,
      private readonly createOfficeUseCase: CreateOfficeUseCase
    ) {}
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCommissionOfOffice(@CurrentUser() user) {
      const userId = user.sub;
      const data = await this.getCommissionOfOfficeUseCase.execute(userId);
      return successResponse(data, 'تم ارجاع عمولة المكتب', 200);
    }
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createOffice(
      @CurrentUser() user,
      @Body() dto: CreateOfficeDto
    ) {
      const userId = user.sub;
      const result = await this.createOfficeUseCase.execute(userId, dto);
      return successResponse(result, 'تم إنشاء المكتب بنجاح', 201);
    }
  }
 