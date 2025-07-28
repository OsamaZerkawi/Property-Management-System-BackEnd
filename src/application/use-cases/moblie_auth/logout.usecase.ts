 
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenBlackListService } from 'src/application/services/authTokenBlacklist.service';
import { MOBILE_AUTH_REPOSITORY } from 'src/domain/repositories/mobile_auth.repository';
import { MobileAuthRepository } from 'src/infrastructure/repositories/mobile_auth.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
 
@Injectable()
export class LogoutUseCase {
  constructor(
        private readonly jwtService: JwtService,
        private readonly tokenBlackListService: AuthTokenBlackListService,
        @Inject(MOBILE_AUTH_REPOSITORY)
        private readonly mobileAuthRepo: MobileAuthRepository) {}
 
  async execute(userId: number, accessToken: string) {
  
    const payload = this.jwtService.decode(accessToken) as { exp: number };
    if (!payload?.exp) {
      throw new UnauthorizedException(
        errorResponse('Invalid token payload', 401),
      );
    }
 
    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

    await this.tokenBlackListService.addToBlackList(accessToken,expiresIn,userId)

    await this.mobileAuthRepo.deleteRefreshToken(userId);
  }    
   
}
