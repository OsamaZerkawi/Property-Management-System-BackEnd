// src/infrastructure/modules/mobile_auth.module.ts

import { Module } from '@nestjs/common';
import { MobileAuthController } from 'src/presentation/http/controllers/mobile_auth.controller';

import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case';

import { OtpService } from 'src/application/services/otp.service';
import { RedisCacheService } from 'src/application/services/redis-cache.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity'; 
import { UserRepository } from 'src/infrastructure/repositories/user.property'; 
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    // إعداد الكاش باستخدام Redis
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
        }),
        ttl: 300, // default TTL
      }),
    }),
  ],
  controllers: [MobileAuthController],
  providers: [
    // UseCases
    CreateUserUseCase,
    VerifyOtpUseCase,

    // Services
    OtpService,
    RedisCacheService,

    // Repository Binding
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class MobileAuthModule {}
