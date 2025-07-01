// src/infrastructure/modules/mobile_auth.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAuthController } from 'src/presentation/http/controllers/mobile_auth.controller';

import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case';

import { OtpService } from 'src/application/services/otp.service';

import { User } from 'src/domain/entities/user.entity';

import { Otp } from "src/domain/entities/otp.entity";
import { TempUserOrm } from "src/domain/entities/temp-user.entity";
import { MobileAuthRepository } from 'src/infrastructure/repositories/mobile_auth.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.property';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';

@Module({
  imports: [
    // ✅ أضف كل الكيانات التي تحتاج Repositories لها
    TypeOrmModule.forFeature([User, TempUserOrm, Otp]),
  ],
  controllers: [MobileAuthController],
  providers: [
    // UseCases
    CreateUserUseCase,
    VerifyOtpUseCase,

    // Repositories
    MobileAuthRepository,
    UserRepository,

    // Services
    OtpService,

    // Bind interfaces
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class MobileAuthModule {}
