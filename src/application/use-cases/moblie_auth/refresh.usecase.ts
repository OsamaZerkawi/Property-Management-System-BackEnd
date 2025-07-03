// src/application/use-cases/auth/refresh.usecase.ts
import { Injectable, UnauthorizedException, Inject,NotFoundException } from '@nestjs/common'; 
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import {JwtService} from 'src/application/services/mobileAuthToken.service';
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
    private readonly jwtService: JwtService,
 
  ) {}

 
async execute(userId: number, refreshToken: string): Promise<string> {
 
    const isValid = await this.jwtService.validateRefreshToken(
      userId,
      refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException(
        errorResponse('رمز التحديث غير صالح', 401),
      );
    }
 
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException(
        errorResponse('المستخدم غير موجود', 404),
      );
    }
 
    const newAccessToken = await this.jwtService.generateAccessToken({
        sub: user.id,
        email: user.email,
      });
      

     // await this.tokenBlackListService.addToBlackList(oldAccessToken);

    return newAccessToken;
  }
}

