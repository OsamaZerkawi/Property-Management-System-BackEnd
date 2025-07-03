// src/infrastructure/repositories/mobile_auth.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoreThan } from 'typeorm';

import { MobileAuthRepositoryInterface } from 'src/domain/repositories/mobile_auth.repository';

import { TempUser }     from 'src/domain/entities/temp-user.entity';
import { Otp, OtpType } from 'src/domain/entities/otp.entity';
import { RefreshToken } from 'src/domain/entities/refresh-token.entity';
import { User }         from 'src/domain/entities/user.entity';

@Injectable()
export class MobileAuthRepository implements MobileAuthRepositoryInterface {
  constructor(
    @InjectRepository(TempUser)     private readonly tempRepo:    Repository<TempUser>,
    @InjectRepository(Otp)          private readonly otpRepo:     Repository<Otp>,
    @InjectRepository(RefreshToken) private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(User)         private readonly userRepo:    Repository<User>,
  ) {}

  // Temp users
  saveTempUser(temp: Partial<TempUser>): Promise<TempUser> {
    return this.tempRepo.save(temp);
  }

  findTempUserByEmail(email: string): Promise<TempUser | null> {
    return this.tempRepo.findOne({ where: { email } });
  }

  deleteTempUserByEmail(email: string): Promise<void> {
    return this.tempRepo.delete({ email }).then(() => undefined);
  }

  // OTPs
  saveOtp(otp: Partial<Otp>): Promise<Otp> {
    return this.otpRepo.save(otp);
  }

  async findLatestValidOtp(email: string, type: OtpType, now: Date): Promise<Otp | null> {
    return await this.otpRepo.findOne({
      where: { email, type, expires_at: MoreThan(now) },
      order: { created_at: 'DESC' },
    });
  }

  deleteOtp(email: string, type: OtpType): Promise<void> {
    return this.otpRepo.delete({ email, type }).then(() => undefined);
  }
  async findValidOtp(email: string, type: OtpType, now: Date) {
    const otp = await this.otpRepo.findOne({
      where: { email, type },
      order: { created_at: 'DESC' },
    });
    if (otp && otp.expires_at > now) {
      return { code: otp.code, expires_at: otp.expires_at };
    }
    return null;
  }
  // Permanent users
  saveUser(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // Refresh tokens (rotate)
  async updateRefreshToken(userId: number, refreshToken: string, expiresAt: Date): Promise<void> {
    await this.refreshRepo.delete({ user: { id: userId } });
    await this.refreshRepo.save({ refreshToken, expiredAt: expiresAt, user: { id: userId } });
  }

  deleteRefreshToken(userId: number): Promise<void> {
    return this.refreshRepo.delete({ user: { id: userId } }).then(() => undefined);
  }

  getUserWithRefreshToken(userId: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['refreshToken'],
    });
  }
  findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshRepo.findOne({
      where: { refreshToken: token },
      relations: ['user'],
    });
  }
}
