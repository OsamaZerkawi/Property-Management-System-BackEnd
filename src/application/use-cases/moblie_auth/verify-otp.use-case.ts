// src/application/use-cases/confirm-signup.use-case.ts
import { Injectable, BadRequestException,Inject } from '@nestjs/common';

import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';
import { OtpType }        from 'src/domain/entities/otp.entity';
import { User }        from 'src/domain/entities/user.entity';
import { MobileAuthRepository } from 'src/infrastructure/repositories/mobile_auth.repository';
import { UserRepositoryInterface, USER_REPOSITORY} from 'src/domain/repositories/user.repository';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    private repo: MobileAuthRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryInterface,
  ) {}

  async execute(dto: VerifyOtpDto): Promise<void> {
    const otp = await this.repo.findOtp(dto.email, 'signup' as OtpType);
    if (!otp || otp.code !== dto.otp || otp.expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const temp = await this.repo.findTempByEmail(dto.email);
    if (!temp) {
      throw new BadRequestException('Registration data expired');
    }

    await this.userRepo.save({
      first_name: temp.first_name,
      last_name: temp.last_name,
      phone: temp.phone,
      photo: temp.photo,
      email: temp.email,
      password: temp.password,
    } as User);

    await this.repo.deleteTempByEmail(dto.email);
    await this.repo.deleteOtp(dto.email, 'signup' as OtpType);
  }
}
