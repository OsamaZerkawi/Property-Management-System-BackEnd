// src/domain/use-cases/verify-otp.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto';
import { UserRepositoryInterface } from 'src/domain/repositories/user.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepositoryInterface,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,  ) {}

  async execute(dto: VerifyOtpDto): Promise<void> {
    const key = `reg:${dto.email}`;
  
    const storedOtp = await this.cacheManager.get<string>(`${key}:otp`);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new Error('Invalid or expired OTP');
    }
  
    const data = await this.cacheManager.get<string>(key);
    if (!data) throw new Error('Registration data expired');
  
    const { first_name, last_name, phone, photo, email, password } = JSON.parse(data);
    const hash = await bcrypt.hash(password, 10);
  
    const user = new User();
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone = phone;
    user.photo = photo;
    user.email = email;
    user.password = hash;
  
    await this.userRepo.save(user);
    await this.cacheManager.del(key);
    await this.cacheManager.del(`${key}:otp`);
  }
  
}
