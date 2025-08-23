// src/application/use-cases/auth/login.usecase.ts
import { Inject, Injectable,ForbiddenException } from '@nestjs/common';
import { JwtService } from 'src/application/services/mobileAuthToken.service';
import {
  MOBILE_AUTH_REPOSITORY,
  MobileAuthRepositoryInterface,
} from 'src/domain/repositories/mobile_auth.repository';
import { User } from 'src/domain/entities/user.entity';
import { MobileLoginWithDeviceDto } from 'src/application/dtos/mobile_auth/fcm-token-device-id.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly mobileAuthRepo: MobileAuthRepositoryInterface,
  ) {}

    async execute(user: User, dto?: MobileLoginWithDeviceDto) {
     const accessToken = await this.jwtService.generateAccessToken(
      user.id,
      user.email,
    );

    const { token: refreshToken, expiresAt } =
      await this.jwtService.generateRefreshToken({
        sub: user.id,
        email: user.email,
      });
 
    await this.mobileAuthRepo.updateRefreshToken(user.id, refreshToken, expiresAt);
 
    try {
      if (dto?.fcm_token) { 
        const deviceId = dto.device_id ?? `device_${user.id}`;
        await this.mobileAuthRepo.saveOrUpdateToken(user.id, deviceId, dto.fcm_token);
      }
    } catch (err) { 
      console.warn('Failed to save FCM token:', err);
    }

    return { accessToken, refreshToken };
  }
}
