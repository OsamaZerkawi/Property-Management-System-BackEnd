import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async createCheckoutSession(amount: number, currency: string, successUrl: string, cancelUrl: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: { name: 'Your Product Name' },
          unit_amount: amount,  
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
    });
    return session;
  }
   async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }, 
    });
    return paymentIntent.client_secret;
  }
}
