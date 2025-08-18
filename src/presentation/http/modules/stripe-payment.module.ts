import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from 'src/application/services/stripe.service';
import { StripePaymentController } from '../controllers/stripe-payment.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenBlackListService } from 'src/application/services/authTokenBlacklist.service';
import { AuthModule } from './auth.module';
 
@Module({
  imports: [ConfigModule,AuthModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (config: ConfigService) => { 
        const secretKey = config.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
          throw new Error('STRIPE_SECRET_KEY is not defined in .env');
        }
        return new Stripe(secretKey);      
    },
      inject: [ConfigService],
    }, 
    StripeService, 
  ],
  controllers: [StripePaymentController], 
  exports: [StripeService],
})
export class StripePaymentModule {}