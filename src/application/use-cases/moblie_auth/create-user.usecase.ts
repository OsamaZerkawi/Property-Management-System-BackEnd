// src/application/use-cases/signup.use-case.ts
import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { OtpService } from 'src/application/services/otp.service';
import { OtpType, Otp } from 'src/domain/entities/otp.entity';
import { TempUser } from 'src/domain/entities/temp-user.entity';

import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';
import { MOBILE_AUTH_REPOSITORY, MobileAuthRepositoryInterface } from 'src/domain/repositories/mobile_auth.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly repoAuth: MobileAuthRepositoryInterface,

    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,

    private readonly otpService: OtpService,
    
  ) {}

  async execute(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    await this.repoAuth.saveTempUser({
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      photo: dto.photo,
      email: dto.email,
      password: hashed,
    });

    const code = this.otpService.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60_000);

    await this.repoAuth.saveOtp({
      email: dto.email,
      code,
      type: 'signup' as OtpType,
      expires_at: expiresAt,
    });

    await this.otpService.sendOtp(dto.email, code);
  }
}
