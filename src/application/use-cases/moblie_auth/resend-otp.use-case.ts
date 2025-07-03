// src/application/use-cases/resend-otp.use-case.ts
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ResendOtpDto } from 'src/application/dtos/mobile_auth/resend-otp.dto';
import { OtpService } from 'src/application/services/otp.service';
import { MOBILE_AUTH_REPOSITORY, MobileAuthRepositoryInterface } from 'src/domain/repositories/mobile_auth.repository';
import { OtpType } from 'src/domain/entities/otp.entity';

@Injectable()
export class ResendOtpUseCase {
  constructor(
    @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly repoAuth: MobileAuthRepositoryInterface,
    private readonly otpService: OtpService,
  ) {}

  async execute(dto: ResendOtpDto): Promise<void> {
    const now = new Date();
 
    const existing = await this.repoAuth.findValidOtp(dto.email, dto.type as OtpType, now);
    if (existing) {
      throw new BadRequestException('رمز التحقق قد أُرسل مسبقاً ولم تنتهِ صلاحيته بعد');
    }
    await this.repoAuth.deleteExpiredOtps(dto.email, dto.type, now);
    const code = this.otpService.generateOtp();
    const expiresAt = new Date(now.getTime() + 5 * 60_000);

    await this.repoAuth.saveOtp({
      email:      dto.email,
      code,
      type:       dto.type,
      expires_at: expiresAt,
    });
 
    await this.otpService.sendOtp(dto.email, code);
  }
}
