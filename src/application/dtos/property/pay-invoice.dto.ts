 import { IsNotEmpty, IsString } from 'class-validator';
 
export class PayInvoiceDto {
  @IsNotEmpty()
  @IsString()
  paymentIntentId: string;
}
