import { Injectable } from '@nestjs/common';
import { GetCommissionOfOfficeUseCase } from 'src/application/use-cases/office/get-commission-of-office.use-case';
import { GetRentalPriceUseCase} from 'src/application/use-cases/residential/get-rental-price.use-case';
@Injectable()
export class PropertyFeeService {
  constructor(
    private readonly getOfficeCommissionUseCase: GetCommissionOfOfficeUseCase, 
    private readonly getRentalPriceUseCase: GetRentalPriceUseCase,
  ) {}

  async getCommissionAndRental(propertyId: number, userId: number) { 
    const { commission } = await this.getOfficeCommissionUseCase.execute(userId); 
    const { rental_price } = await this.getRentalPriceUseCase.execute(propertyId);
     
    return {    
       commission,
       rental_price, 
    };
}
}