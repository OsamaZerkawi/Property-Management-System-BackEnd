import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from 'src/application/services/stripe.service';
import { StripeController } from '../controllers/stripe.controller';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (config: ConfigService) => { 
        const secretKey = config.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
          throw new Error('STRIPE_SECRET_KEY is not defined in .env');
        }
        return new Stripe(secretKey );      
    },
      inject: [ConfigService],
    },
    StripeService,
  ],
  controllers: [StripeController], 
  exports: [StripeService],
})
export class StripeModule {}
