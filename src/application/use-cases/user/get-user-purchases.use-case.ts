 
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
 
async execute(userId: number,page: number,items: number, baseUrl: string) {
  const  { raws, total } = await this.purchaseRepo.findByUserId(userId,page,items);

  const data =  raws.map(r => ({
    id:           r.purchaseId,
    status:       r.status,
    date:         format(new Date(r.date), 'yyyy-MM-dd'),
    property_id:  r.propertyId,
    title:        r.postTitle,
    image:        r.postImage
      ? `${baseUrl}/uploads/properties/posts/images/${r.postImage}`
      : null,
    address:      `${r.cityName},${r.regionName}`,
  }));

  return { data, total};
  }
}
