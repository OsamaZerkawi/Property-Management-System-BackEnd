import {Inject, Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { GetPaymentMethodDto } from 'src/application/dtos/office/get-payment-method.dto';
 
@Injectable()
export class GetOfficePaymentMethodUseCase {
  constructor( @Inject(OFFICE_REPOSITORY)
  private readonly officeRepo: OfficeRepositoryInterface  ) {}

  async execute(userId: number): Promise<GetPaymentMethodDto> {
    const office =  await this.officeRepo.findOneByUserId(userId);

    if (!office) throw new NotFoundException('المكتب غير موجود');
     return { paymentMethod: office.getPaymentMethod() };
  }
  
}
