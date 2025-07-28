 
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UnauthorizedException, UseGuards,UploadedFile } from "@nestjs/common";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto'; 
import { ResendOtpDto } from "src/application/dtos/mobile_auth/resend-otp.dto";
import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case';  
import { Public } from "src/shared/decorators/public.decorator";
import { LoginUseCase } from 'src/application/use-cases/moblie_auth/login.usecase';
import { RefreshUseCase } from 'src/application/use-cases/moblie_auth/refresh.usecase'; 
import { MobileLocalAuthGuard} from 'src/shared/guards/mobile-local.guard';
import { RefreshJwtGuard } from "src/shared/guards/refresh-jwt.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";
import { UserProfileImageInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { ResendOtpUseCase } from 'src/application/use-cases/moblie_auth/resend-otp.use-case';
import { ResetPasswordUseCase } from 'src/application/use-cases/moblie_auth/reset-password.use-case';
import {ResetPasswordDto} from 'src/application/dtos/mobile_auth/reset-password.dto';
import { SignupSwaggerDoc } from "../swagger/mobile-auth/signup.swagger";
import { ConfirmOtpSwaggerDoc } from "../swagger/mobile-auth/confirm-otp.swagger";
import { ResendOtpSwaggerDoc } from "../swagger/mobile-auth/resend-otp.swagger";
import { RefreshTokenSwaggerDoc } from "../swagger/mobile-auth/refresh.swagger";
import { MobileLoginSwaggerDoc } from "../swagger/mobile-auth/login.swagger";
import { ResetPasswordSwaggerDoc } from "../swagger/mobile-auth/reset-password.swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { LogoutUseCase } from "src/application/use-cases/moblie_auth/logout.usecase";
 @Controller('mobile-auth')
export class MobileAuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly verifyOtp: VerifyOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}


  @Public()
  @SignupSwaggerDoc()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ UserProfileImageInterceptor()
  async signup(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUserDto,
  ) { 
    if (file) {
      body.photo = file.path;
    }
    await this.createUser.execute(body);
    return successResponse( [], 'تم إرسال رمز التحقق. يرجى التحقق من بريدك الإلكتروني.' );
  } 


  @Public()
  @ConfirmOtpSwaggerDoc()
  @Post('confirm')
  async confirm(@Body() body: VerifyOtpDto) {
    await this.verifyOtp.execute(body);
    return successResponse( [], 'تم إنشاء الحساب بنجاح.' );
  }
  
  @Public()
  @ResendOtpSwaggerDoc()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.resendOtpUseCase.execute(dto);
    return successResponse([],'تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني.',200)
  }

  @Public()
  @RefreshTokenSwaggerDoc()
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
  @MobileLoginSwaggerDoc()
  @UseGuards(MobileLocalAuthGuard)
  @Post('login') 
  async login(@Req() req) {
    const user = req.user;
    const tokens = await this.loginUseCase.execute(user);

    return successResponse(tokens, 'تم تسجيل الدخول بنجاح',200);
  }

  @Public()
  @ResetPasswordSwaggerDoc()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(dto);
    return successResponse([], 'تم تغيير كلمة المرور بنجاح',200);
  }

  @Post('logout') 
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) { 
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.split(' ')[1];
    await this.logoutUseCase.execute(req.user.sub, accessToken);
    return successResponse([], 'تم تسجيل الخروج بنجاح');
  }
}
