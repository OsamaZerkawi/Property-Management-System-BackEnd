// dto/create-property-purchase.dto.ts
export class CreatePropertyPurchaseDto {
  propertyId: number;
  deposit: number;
  totalPrice: number;
  payment_id?: string | null;
  installment?: boolean; 
}
