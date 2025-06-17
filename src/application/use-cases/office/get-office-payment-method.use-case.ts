import {Inject, Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { GetPaymentMethodDto } from 'src/application/dtos/office/get-payment-method.dto';

@Injectable()
export class GetOfficePaymentMethodUseCase {
  constructor( @Inject(OFFICE_REPOSITORY)
  private readonly officeRepo: OfficeRepositoryInterface  ) {}

  async execute(userId: number,officeId: number): Promise<GetPaymentMethodDto> {
  const office = await this.officeRepo.findById(officeId);
    if (!office) throw new NotFoundException('المكتب غير موجود');
    if (office.user.id !== userId) throw new ForbiddenException('لا تملك صلاحية مشاهدة هذا المكتب');
    return { paymentMethod: office.getPaymentMethod() };
  }
  
}
