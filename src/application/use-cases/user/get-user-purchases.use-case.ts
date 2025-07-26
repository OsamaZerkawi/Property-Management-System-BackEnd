 
import { Injectable, Inject } from '@nestjs/common';
import {
  USER_PURCHASE_REPOSITORY,
  UserPurchaseRepositoryInterface,
} from 'src/domain/repositories/user-purchase.repository';
import { format } from 'date-fns';
@Injectable()
export class GetUserPurchasesUseCase {
  constructor(
    @Inject(USER_PURCHASE_REPOSITORY)
    private readonly purchaseRepo: UserPurchaseRepositoryInterface,
  ) {}
 
  async execute(userId: number) {
    const raws = await this.purchaseRepo.findByUserId(userId);

   return raws.map(r => ({
    id:              r.purchaseId,
    status:          r.status,
    date:            format(new Date(r.date), 'yyyy-MM-dd'),    
    residential_id:  r.residentialId,
    title:           r.postTitle,
    address:         `${r.cityName},${r.regionName}`,         
  }));
  }
}
