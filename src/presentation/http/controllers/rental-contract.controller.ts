// src/infrastructure/controllers/rental-contract.controller.ts
import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CreateRentalContractUseCase } from 'src/application/use-cases/rental/create-rental-contract.use-case';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateRentalContractDto } from 'src/application/dtos/rental_contracts/create-rental-contract.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
  
@Controller('rental-contracts')
export class RentalContractController {
  constructor(
    private readonly createRentalContractUseCase: CreateRentalContractUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)  
  async create(
    @CurrentUser()user,
    @Body() dto: CreateRentalContractDto
  ) { 
    console.log('dto',dto);
    return this.createRentalContractUseCase.execute(user.sub, dto);
  }
}