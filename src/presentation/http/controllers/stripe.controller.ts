import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from 'src/application/services/stripe.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post('create-checkout-session')
  async create(@Body() dto: { amount: number; currency: string }) {
    const protocol = 'https';
    const host = '0ad82425026d.ngrok-free.app';  
    const successUrl = `${protocol}://${host}/success`;
    const cancelUrl  = `${protocol}://${host}/cancel`;

    const session = await this.stripeService.createCheckoutSession(
      dto.amount,
      dto.currency,
      successUrl,
      cancelUrl,
    );
    return { url: session.url };
  }
  @Public()
  @Post('create-payment-intent')
  async createIntent(@Body() dto: { amount: number; currency: string }) {
    const clientSecret = await this.stripeService.createPaymentIntent(
      dto.amount,
      dto.currency,
    );
    return { clientSecret };
  }
}
