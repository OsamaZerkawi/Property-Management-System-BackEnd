// src/infrastructure/repositories/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

 import { TempUserOrm } from 'src/domain/entities/temp-user.entity';
import { Otp, OtpType }      from 'src/domain/entities//otp.entity';

@Injectable()
export class MobileAuthRepository {
  constructor(
    @InjectRepository(TempUserOrm) private tempRepo:  Repository<TempUserOrm>,
    @InjectRepository(Otp)      private otpRepo:   Repository<Otp>,
  ) {}

  

  // TempUsers
  findTempByEmail(email: string) {
    return this.tempRepo.findOne({ where: { email } });
  }
  saveTemp(entity: Partial<TempUserOrm>) {
    return this.tempRepo.save(entity);
  }
  deleteTempByEmail(email: string) {
    return this.tempRepo.delete({ email });
  }

  // OTPs
  findOtp(email: string, type: OtpType) {
    return this.otpRepo.findOne({ where: { email, type } });
  }
  saveOtp(entity: Partial<Otp>) {
    return this.otpRepo.save(entity);
  }
  deleteOtp(email: string, type: OtpType) {
    return this.otpRepo.delete({ email, type });
  }
}
