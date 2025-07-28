 
import { Injectable,Inject } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
    MOBILE_AUTH_REPOSITORY,
    MobileAuthRepositoryInterface,
  } from 'src/domain/repositories/mobile_auth.repository';
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService,
     @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly authRepo: MobileAuthRepositoryInterface
  ) {}
 
   async generateAccessToken(userId: number, email: string): Promise<string> {
  const accessToken = await this.jwtService.signAsync(
    { sub: userId, email },
    {
      secret: process.env.JWT_TOKEN_SECRET,
      expiresIn: 60 * 60 *24 * 90,
      jwtid: randomUUID()
    },
  );
  return accessToken;
}

  async generateRefreshToken(payload: { sub: number; email: string }) {
    const token = await this.jwtService.signAsync(
      payload,
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }
    ); 
    const decoded = this.jwtService.decode(token) as { exp: number };
    return { token, expiresAt: new Date(decoded.exp * 1000) };
  }
 
    async validateRefreshToken(userId: number, incomingToken: string){
   
          const user = await this.authRepo.getUserWithRefreshToken(userId);
          console.log('token',user?.refreshToken.refreshToken);
          if(!user || !user.refreshToken || new Date() > user.refreshToken.expiredAt){
              return false;
          } 
          return incomingToken === user.refreshToken.refreshToken;
      }
}
