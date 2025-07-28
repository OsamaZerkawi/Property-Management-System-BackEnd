 


export const USER_PURCHASE_REPOSITORY = 'USER_PURCHASE_REPOSITORY';

export interface UserPurchaseRepositoryInterface { 
  findByUserId(userId: number): Promise<Array<{
    purchaseId: number;
    status: string;
    date: Date;
    propertyId: number;
    postTitle: string;
    postImage: string;
    regionName: string;
    cityName: string;

  }>>;

}
