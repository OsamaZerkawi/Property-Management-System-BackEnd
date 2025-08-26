import { Residential } from "../entities/residential.entity";
import { UserPropertyPurchase } from "../entities/user-property-purchase.entity";
import { User } from "../entities/user.entity";

 


export const USER_PURCHASE_REPOSITORY = 'USER_PURCHASE_REPOSITORY';

export interface UserPurchaseRepositoryInterface { 
  findByUserId(userId: number,page:number,items: number);
  findOneByUserIdAndPropertyId(userId: number,propertyId: number);
  bookPropertyForUser(residential: Residential, user: User);
  save(purchase: UserPropertyPurchase);
}
