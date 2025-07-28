// src/infrastructure/modules/mobile_auth.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAuthController } from 'src/presentation/http/controllers/mobile_auth.controller'; 
import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case'; 
import { OtpService } from 'src/application/services/otp.service'; 
import { User } from 'src/domain/entities/user.entity'; 
import { Otp } from "src/domain/entities/otp.entity";
import { TempUser } from "src/domain/entities/temp-user.entity";
import { MobileAuthRepository } from 'src/infrastructure/repositories/mobile_auth.repository'; 
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "src/infrastructure/auth/strategies/jwt.strategy";
import { LoginUseCase } from 'src/application/use-cases/moblie_auth/login.usecase';
import { RefreshUseCase } from 'src/application/use-cases/moblie_auth/refresh.usecase';
import { JwtService } from 'src/application/services/mobileAuthToken.service'; 
import { RefreshToken} from 'src/domain/entities/refresh-token.entity';
import {MobileLocalStrategy } from 'src/infrastructure/auth/strategies/mobile_local.strategy'
import { MOBILE_AUTH_REPOSITORY } from 'src/domain/repositories/mobile_auth.repository'; 
import {MobileValidateUserUseCase} from 'src/application/use-cases/moblie_auth/validate-user.use-case'
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.property'; 
import { RefreshTokenStrategy } from "src/infrastructure/auth/strategies/referesh-token.strategy";   
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RefreshJwtGuard } from 'src/shared/guards/refresh-jwt.guard';   
import { ResendOtpUseCase } from 'src/application/use-cases/moblie_auth/resend-otp.use-case';
import { ResetPasswordUseCase } from 'src/application/use-cases/moblie_auth/reset-password.use-case';
import { AuthTokenBlackListService } from 'src/application/services/authTokenBlacklist.service';
import { jwtConfig } from 'src/infrastructure/config/jwt.config';
import { LogoutUseCase } from "src/application/use-cases/moblie_auth/logout.usecase";
import { TokenBlackList } from 'src/domain/entities/token-blacklist.entity';
import { AUTH_REPOSITORY } from 'src/domain/repositories/auth.repository';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';

@Module({
  imports: [
    ConfigModule,  
    PassportModule,
    TypeOrmModule.forFeature([User, TempUser, Otp, RefreshToken,TokenBlackList]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [MobileAuthController],
  providers: [
    // Repositories
    { provide: MOBILE_AUTH_REPOSITORY, useClass: MobileAuthRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: AUTH_REPOSITORY, useClass: AuthRepository },
    // Use Cases
    CreateUserUseCase,
    VerifyOtpUseCase,
    MobileValidateUserUseCase,
    LoginUseCase,
    RefreshUseCase,
    ResendOtpUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    // Strategies
    MobileLocalStrategy,
    JwtStrategy,         
    RefreshTokenStrategy,   

    // Guards
    JwtAuthGuard,         
    RefreshJwtGuard,     
    // Services
    OtpService,
    JwtService,      
    AuthTokenBlackListService
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtAuthGuard,
    RefreshJwtGuard, 
    AuthTokenBlackListService
  ],
})
export class MobileAuthModule {}
