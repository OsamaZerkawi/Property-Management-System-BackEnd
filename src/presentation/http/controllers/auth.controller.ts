import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request as requsetExpress } from "express";
import { LoginDto } from "src/application/dtos/auth/login.dto";
import { LoginUseCase } from "src/application/use-cases/auth/login.use-case";
import { LogoutUseCase } from "src/application/use-cases/auth/logout.use-case";
import { RefreshTokenUseCase } from "src/application/use-cases/auth/refresh.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { RefreshJwtGuard } from "src/shared/guards/refresh-jwt.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase
    ){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req ,@Body() loginDto: LoginDto){
      const {user , tokens} =  await this.loginUseCase.execute(loginDto);

      const { password, ...userWithoutPassword } = user;

      const data = {
        user : userWithoutPassword,
        tokens,
      };

      return successResponse(data,'تم تسجيل الدخول بنجاح'); 
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() request: requsetExpress,@CurrentUser() user){
      const authHeader = request.headers.authorization;
      const accesssToken = authHeader?.split(' ')[1];

      this.logoutUseCase.execute(user.sub,accesssToken);

      return successResponse([],'تم تسجيل الخروج بنجاح');
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() request : requsetExpress, @CurrentUser() userInfo){
      const refreshToken = request.get('Authorization')?.replace('Bearer','').trim();

      if(!refreshToken){
        throw new UnauthorizedException(
          errorResponse('رمز التحديث غير موجود',401)
        );
      }
      
      const userId = userInfo.sub;

      const newAccessToken = await this.refreshTokenUseCase.execute(userId,refreshToken);

      const data = {
          user : {
            id: +userId
          },
          accessToken :  newAccessToken
      };

      return successResponse(data,'تم تحديث رمز الدخول بنجاح');
    }
}