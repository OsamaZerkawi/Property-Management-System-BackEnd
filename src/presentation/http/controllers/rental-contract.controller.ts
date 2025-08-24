// src/infrastructure/controllers/rental-contract.controller.ts
import { Body, Controller, Post, UseGuards, Req, UploadedFile, BadRequestException, Get, Query, ParseIntPipe, Param, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateRentalContractUseCase } from 'src/application/use-cases/rental/create-rental-contract.use-case';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateRentalContractDto } from 'src/application/dtos/rental_contracts/create-rental-contract.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserInvoiceImageInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { GetRentalContractsUseCase } from 'src/application/use-cases/rental/get-rental-contracts.use-case';
import { Request } from 'express';
import { ContractFiltersDto } from 'src/application/dtos/rental_contracts/filter-rental-contract.dto';
import { errorResponse, successResponse } from 'src/shared/helpers/response.helper';
import { UploadInvoiceDocumentUseCase } from 'src/application/use-cases/rental/upload-document-invoice.use-case';
import { SearchRentalContractsUseCase } from 'src/application/use-cases/rental/search-rental-contracts.use-case';
import { GetContractDetailsUseCase } from 'src/application/use-cases/rental/get-contract-details.use-case';
import { CreateRentalContractSwaggerDoc } from '../swagger/rental-contract/create-contract.swagger';
import { UploadInvoiceDocumentSwaggerDoc } from '../swagger/rental-contract/upload-document.swagger';
import { SearchContractsSwaggerDoc } from '../swagger/rental-contract/search-contract.swagger';
import { GetContractDetailsSwaggerDoc } from '../swagger/rental-contract/get-contract-details.swagger';
import { GetRentalContractsSwaggerDoc } from '../swagger/rental-contract/get-rental-contracts.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRentalRequestDto } from 'src/application/dtos/rental_contracts/create-rental-request.dto';
import { CreateRentalRequestUseCase } from 'src/application/use-cases/rental/create-rental-request.use-case';
 @Controller('rental-contracts')
export class RentalContractController {
    
   constructor(
    private readonly createRentalContractUseCase: CreateRentalContractUseCase,
    private readonly getRentalContractsUseCase: GetRentalContractsUseCase,
    private readonly uploadInvoiceDocumentUseCase: UploadInvoiceDocumentUseCase,
    private readonly searchContractsUseCase:  SearchRentalContractsUseCase,
    private readonly getContractDetailsUseCase: GetContractDetailsUseCase ,
    private readonly createRentalRequestUseCase: CreateRentalRequestUseCase
  ) {}

  @Post('Rent')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRental(
    @Body() dto: CreateRentalRequestDto,
    @CurrentUser()user,
   ) { 
    const result = await this.createRentalRequestUseCase.execute(user.sub, dto);
    return successResponse(result, 'تم إنشاء عقد الإيجار والفواتير بنجاح', HttpStatus.CREATED);
  }

  @Post()
  @CreateRentalContractSwaggerDoc() 
  @UserInvoiceImageInterceptor()
  @UseGuards(JwtAuthGuard)  
  async create(
    @CurrentUser()user,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateRentalContractDto
  ) {  
    if (!file) {
    return errorResponse('يجب ان يكون هناك وثيقة للفاتورة',400);
  } 
  try{
      await this.createRentalContractUseCase.execute(user.sub, dto, file.filename);
      return successResponse(null,'تم انشاء العقد بنجاح',201);
  }
  catch(error){
      const statusCode = error.getStatus?.() || 500;
      const message = error.message || 'حدث خطأ غير متوقع';
      return errorResponse(message, statusCode);
  }
  }

  @Get()
  @GetRentalContractsSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  async getRentalContracts(
    @CurrentUser() user: { sub: number },
    @Req() request: Request,
    @Query() filters: ContractFiltersDto,   
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    try{
    const data= await this.getRentalContractsUseCase.execute(user.sub, baseUrl, filters);
    return successResponse(data,'تم جلب عقود الايجار بنجاح');
    }
    catch(error){
      const statusCode = error.getStatus?.() || 500;
      const message = error.message || 'حدث خطأ غير متوقع';
      return errorResponse(message, statusCode);
    } 
  }

  @Post(':id/document')  
  @UploadInvoiceDocumentSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  @UserInvoiceImageInterceptor()
  async uploadDocument(
    @Param('id', ParseIntPipe) invoiceId: number,
    @UploadedFile() document: Express.Multer.File,
  ) {
    if (!document) {
      return errorResponse( 'يجب إرفاق ملف الفاتورة', 400);
    }

    try {
      await this.uploadInvoiceDocumentUseCase.execute(invoiceId, document.filename);
      return successResponse(null, 'تم رفع الوثيقة بنجاح', 200);
    } catch (error) {
      const statusCode = error.getStatus?.() || 500;
      const message = error.message || 'حدث خطأ غير متوقع';
      return errorResponse(message, statusCode);
    }
  }

  @Get('search')
  @SearchContractsSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  async search(
    @CurrentUser() user,
    @Req() request: Request,
    @Query('title') keyword: string,
  ) { 
    if (!keyword || !keyword.trim()) {
      return errorResponse( 
        'كلمة البحث مطلوبة.',
        400,
      );
    }

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    try { 
      const results = await this.searchContractsUseCase.execute(
        user.sub,
        baseUrl,
        keyword.trim(),
      ); 
      return successResponse(results,'تم جلب العقود بنجاح', 200);
    } catch (err) { 
      const statusCode = err.getStatus?.() || 500;
      const message = err.message || 'حدث خطأ غير متوقع.';
      return errorResponse( message,statusCode);
    }
  }

@Get(':id/details')
@GetContractDetailsSwaggerDoc()
@UseGuards(JwtAuthGuard)
async getContractDetails(
  @Param('id', ParseIntPipe) id: number,
  @Req() request: Request, 
  @CurrentUser() user: any,
) {
  try {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const result = await this.getContractDetailsUseCase.execute(user.sub, id, baseUrl);
    const { formattedContract, invoices } = result;
    const data = {
      ...formattedContract,
      invoices,
    }; 
  return successResponse(data);
  } catch (error) {
    return errorResponse(error.message, error.statusCode || 500);
  }
}

}