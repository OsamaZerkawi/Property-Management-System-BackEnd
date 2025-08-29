import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStripeCustomerDto {
  @IsString()
  @IsNotEmpty()
  stripe_customer_id: string;
}
