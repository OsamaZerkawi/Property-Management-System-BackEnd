 
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto'; 
import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case';  
import { Public } from "src/shared/decorators/public.decorator";

@Controller('mobile-auth')
export class MobileAuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly verifyOtp: VerifyOtpUseCase,
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
}
