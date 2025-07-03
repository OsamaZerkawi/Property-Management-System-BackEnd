 
import { Injectable,Inject } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

  generateAccessToken(payload: { sub: number; email: string }): Promise<string> {
    return this.jwtService.signAsync(
      payload,
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
      }
    );
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
  
          if(!user || !user.refreshToken || new Date() > user.refreshToken.expiredAt){
              return false;
          }
   
          return await bcrypt.compare(incomingToken,user.refreshToken.refreshToken);
      }
}
