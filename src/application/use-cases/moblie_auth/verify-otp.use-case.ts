// src/application/use-cases/confirm-signup.use-case.ts
import { Injectable, BadRequestException,Inject } from '@nestjs/common';
 
import { OtpType }        from 'src/domain/entities/otp.entity';
import { User }        from 'src/domain/entities/user.entity';  
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto'; 
  

import {
  MOBILE_AUTH_REPOSITORY,
  MobileAuthRepositoryInterface,
} from 'src/domain/repositories/mobile_auth.repository';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly repo: MobileAuthRepositoryInterface,

    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}
  async execute(dto: VerifyOtpDto): Promise<void> {
    const now = new Date();
   
    const temp = await this.repo.findTempUserByEmail(dto.email);
    if (!temp) {
      throw new BadRequestException('لم يُسجّل هذا البريد أو لم يُرسل إليه رمز تحقق');    }

    const otp = await this.repo.findLatestValidOtp(dto.email, 'signup', now);
    if (!otp || otp.code !== dto.otp) {
      throw new BadRequestException('رمز التحقق غير صالح أو انتهت صلاحيته');
    }  
   
    await this.userRepo.save({
      first_name: temp.first_name,
      last_name:  temp.last_name,
      phone:      temp.phone,
      photo:      temp.photo,
      email:      temp.email,
      password:   temp.password,
    } as User);
   
    await this.repo.deleteTempUserByEmail(dto.email);
    await this.repo.deleteOtp(dto.email, 'signup');
  }
  
}
