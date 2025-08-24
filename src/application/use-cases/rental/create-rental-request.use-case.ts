// application/use-cases/rentals/create-rental.usecase.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
 
import { Inject } from '@nestjs/common';
import { CreateRentalRequestDto } from 'src/application/dtos/rental_contracts/create-rental-request.dto';
import { RENTAL_CONTRACT_REPOSITORY, RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';

@Injectable()
export class CreateRentalRequestUseCase {
  constructor(
     @Inject(RENTAL_CONTRACT_REPOSITORY)
     private readonly rentalContractRepo: RentalContractRepositoryInterface,
  ) {}

  async execute(userId: number, dto: CreateRentalRequestDto) {
 
    if (!userId) throw new BadRequestException('المستخدم غير مصادق.');
 
    await this.rentalContractRepo.createRentalBooking(
        userId,
        dto.propertyId,
        dto.periodCount,
        dto.totalPrice,
        dto.paymentIntentId
     ); 
   }
}
