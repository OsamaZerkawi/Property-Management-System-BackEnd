 
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto'; 
import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case';  
import { Public } from "src/shared/decorators/public.decorator";
import { LoginUseCase } from 'src/application/use-cases/moblie_auth/login.usecase';
 import { RefreshUseCase } from 'src/application/use-cases/moblie_auth/refresh.usecase'; 
import {LocalAuthGuard} from 'src/shared/guards/local-auth.guard';
import { RefreshJwtGuard } from "src/shared/guards/refresh-jwt.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";
@Controller('mobile-auth')
export class MobileAuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly verifyOtp: VerifyOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    await this.createUser.execute(body);
    return { message: 'OTP sent. Check your email.' };
  }

  @Public()
  @Post('confirm')
  async confirm(@Body() body: VerifyOtpDto) {
    await this.verifyOtp.execute(body);
    return { message: 'Account created successfully.' };
  }

  @Public()
  @UseGuards(RefreshJwtGuard) 
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @CurrentUser() userInfo: { sub: number },
  ) { 
 
    const authHeader = request.headers['authorization'] || '';
    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException(
        errorResponse('رمز التحديث غير موجود', HttpStatus.UNAUTHORIZED),
      );
    }
 
    const newAccessToken = await this.refreshUseCase.execute(
      userInfo.sub,
      refreshToken,
    );
 
    const data = {
      user: { id: userInfo.sub },
      accessToken: newAccessToken,
    };

    return successResponse(data, 'تم تحديث رمز الدخول بنجاح');
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login') 
  async login(@Req() req) {
    const user = req.user;
    const tokens = await this.loginUseCase.execute(user);
    return {
      message: 'Login successful',
      ...tokens,
    };
  }
}
