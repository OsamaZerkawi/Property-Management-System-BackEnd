// src/interface/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto'; 
import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { VerifyOtpUseCase } from 'src/application/use-cases/moblie_auth/verify-otp.use-case';  

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly verifyOtp: VerifyOtpUseCase,
  ) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    await this.createUser.execute(body);
    return { message: 'OTP sent. Check your email.' };
  }

  @Post('confirm')
  async confirm(@Body() body: VerifyOtpDto) {
    await this.verifyOtp.execute(body);
    return { message: 'Account created successfully.' };
  }
}
