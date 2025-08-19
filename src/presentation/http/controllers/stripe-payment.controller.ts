import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StripeService } from 'src/application/services/stripe.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreatePaymentIntentSwaggerDoc } from '../swagger/payment-intent.swagger';

@Controller('payments')
export class StripePaymentController {
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

    @UseGuards(JwtAuthGuard)
    @CreatePaymentIntentSwaggerDoc()
    @Post('create-payment-intent')
    async createIntent(
    @CurrentUser() user,
    @Body() dto: { amount: number }
    ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
        dto.amount,  
        'usd',
        user.sub
    );

    return { 
        clientSecret: paymentIntent.client_secret, 
        paymentId: paymentIntent.id 
    };
    }

}