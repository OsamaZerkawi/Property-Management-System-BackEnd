// src/infrastructure/controllers/rental-contract.controller.ts
import { Body, Controller, Post, UseGuards, Req, UploadedFile, BadRequestException, Get } from '@nestjs/common';
import { CreateRentalContractUseCase } from 'src/application/use-cases/rental/create-rental-contract.use-case';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateRentalContractDto } from 'src/application/dtos/rental_contracts/create-rental-contract.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserInvoiceImageInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { GetRentalContractsUseCase } from 'src/application/use-cases/rental/get-rental-contracts.use-case';
import { Request } from 'express';
@Controller('rental-contracts')
export class RentalContractController {
  constructor(
    private readonly createRentalContractUseCase: CreateRentalContractUseCase,
     private readonly getRentalContractsUseCase: GetRentalContractsUseCase
  ) {}

  @Post()
  @UserInvoiceImageInterceptor()
  @UseGuards(JwtAuthGuard)  
  async create(
    @CurrentUser()user,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateRentalContractDto
  ) {  
    if (!file) {
    throw new BadRequestException('يجب ان يكون هناك وثيقة للفاتورة');
  } 
    return this.createRentalContractUseCase.execute(user.sub, dto, file.filename);
  }

@Get()
@UseGuards(JwtAuthGuard)
async getRentalContracts(
  @CurrentUser() user: { sub: number },
   @Req() request: Request,
) {
  const baseUrl = `${request.protocol}://${request.get('host')}`;
  return this.getRentalContractsUseCase.execute(user.sub, baseUrl);
}

}