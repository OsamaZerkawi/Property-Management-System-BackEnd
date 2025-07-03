// src/application/use-cases/auth/login.usecase.ts
import { Inject, Injectable,ForbiddenException } from '@nestjs/common';
import { JwtService } from 'src/application/services/mobileAuthToken.service';
import {
  MOBILE_AUTH_REPOSITORY,
  MobileAuthRepositoryInterface,
} from 'src/domain/repositories/mobile_auth.repository';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly mobileAuthRepo: MobileAuthRepositoryInterface,
  ) {}

  async execute(user: User) {
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

    return { accessToken, refreshToken };
  }
}
