// src/domain/repositories/mobile_auth.repository.ts
import { FindOptionsWhere } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import { TempUser } from 'src/domain/entities/temp-user.entity';
import { Otp, OtpType } from 'src/domain/entities/otp.entity';

export const MOBILE_AUTH_REPOSITORY = 'MOBILE_AUTH_REPOSITORY';

export interface MobileAuthRepositoryInterface {
  // Temp users
  saveTempUser(temp: Partial<TempUser>): Promise<TempUser>;
  findTempUserByEmail(email: string): Promise<TempUser | null>;
  deleteTempUserByEmail(email: string): Promise<void>;

  // OTPs
  saveOtp(otp: Partial<Otp>): Promise<Otp>;
  findLatestValidOtp(email: string, type: OtpType,now: Date): Promise<Otp | null>;
  deleteOtp(email: string, type: OtpType): Promise<void>;
  findValidOtp(email: string, type: OtpType, now: Date): Promise< { code: string; expires_at: Date } | null >;
  // Permanent users
  saveUser(user: Partial<User>): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;

  // Refresh tokens
  updateRefreshToken(userId: number, refreshToken: string, expiresAt: Date): Promise<void>;
  deleteRefreshToken(userId: number): Promise<void>;
  getUserWithRefreshToken(userId: number): Promise<User | null>;
  findRefreshToken(token: string);
}
