// src/infrastructure/controllers/rental-contract.controller.ts
import { Body, Controller, Post, UseGuards, Req, UploadedFile, BadRequestException } from '@nestjs/common';
import { CreateRentalContractUseCase } from 'src/application/use-cases/rental/create-rental-contract.use-case';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateRentalContractDto } from 'src/application/dtos/rental_contracts/create-rental-contract.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserInvoiceImageInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
  
@Controller('rental-contracts')
export class RentalContractController {
  constructor(
    private readonly createRentalContractUseCase: CreateRentalContractUseCase,
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
}