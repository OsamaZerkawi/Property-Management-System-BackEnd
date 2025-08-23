// application/use-cases/purchase/create-purchase.usecase.ts
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreatePurchaseDto } from 'src/application/dtos/property/create-property-purchase.dto';
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from 'src/domain/repositories/residential-property.repository';
 
@Injectable()
export class CreatePurchaseUseCase {
  constructor(
    @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
    private readonly residentialRepo: ResidentialPropertyRepositoryInterface,
  ) {}

  async execute(userId: number, dto: CreatePurchaseDto): Promise<void> {
 
    if (dto.deposit > dto.totalPrice) {
      throw new BadRequestException('قيمة العربون لا يمكن أن تكون أكبر من السعر الإجمالي');
    }

    await this.residentialRepo.createPurchaseWithInvoices({
      userId,
      propertyId: dto.propertyId,
      deposit: dto.deposit,
      totalPrice: dto.totalPrice,
      paymentIntentId: dto.paymentIntentId ?? null,
      installment: dto.installment,
    });
  }
}
