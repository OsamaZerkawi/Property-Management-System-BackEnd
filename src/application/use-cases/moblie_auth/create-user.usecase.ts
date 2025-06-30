// src/domain/use-cases/register-user.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { UserRepositoryInterface } from 'src/domain/repositories/user.repository';
import { OtpService } from 'src/application/services/otp.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepositoryInterface,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly otpService: OtpService,
  ) {}

  async execute(dto: CreateUserDto): Promise<void> {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) throw new Error('Email already in use');

    const key = `reg:${dto.email}`;

    // ✅ خزّن البيانات والـ OTP كـ JSON وقيمة، مع TTL كـ رقم
    await this.cacheManager.set(key, JSON.stringify(dto), 300);
    const otp = this.otpService.generateOtp();
    await this.cacheManager.set(`${key}:otp`, otp, 300);

    await this.otpService.sendOtp(dto.email, otp);
  }
}
