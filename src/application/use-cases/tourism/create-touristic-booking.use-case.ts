// application/use-cases/touristic/create-touristic-booking.use-case.ts
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreateTouristicBookingDto } from 'src/application/dtos/tourism-mobile/create-touristic-booking.dto';
 import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';

@Injectable()
export class CreateTouristicBookingUseCase {
  constructor(
    @Inject(TOURISM_REPOSITORY)
    private readonly tourismRepo: ITourismRepository,  
  ) {}

  async execute(userId: number, dto: CreateTouristicBookingDto) {
 
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('تواريخ غير صالحة');
    }
    if (start > end) {
      throw new BadRequestException('startDate يجب أن تكون أصغر أو تساوي endDate');
    }

    if (dto.totalPrice < dto.deposit) {
      throw new BadRequestException('totalPrice يجب أن يكون >= deposit');
    }

 
      await this.tourismRepo.createBookingWithInvoices({
      userId,
      propertyId: dto.propertyId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      deposit: dto.deposit,
      totalPrice: dto.totalPrice,
      payment_id:dto.payment_id
    });
 
 
  }
}
