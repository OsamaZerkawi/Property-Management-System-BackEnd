// src/application/use-cases/signup.use-case.ts
import { Injectable, ConflictException,Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';
import { MobileAuthRepository } from 'src/infrastructure/repositories/mobile_auth.repository';
import { OtpService }     from 'src/application/services/otp.service';
import { OtpType,Otp }        from 'src/domain/entities/otp.entity';
import { TempUserOrm } from 'src/domain/entities/temp-user.entity';
import { UserRepositoryInterface, USER_REPOSITORY} from 'src/domain/repositories/user.repository';
@Injectable()
export class CreateUserUseCase {
  constructor(
    private repoAuth: MobileAuthRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryInterface, 
    private otpService: OtpService,
  ) {}

  async execute(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    await this.repoAuth.saveTemp({
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      photo: dto.photo,
      email: dto.email,
      password: hashed,
    } as Partial<TempUserOrm>);

    const code = this.otpService.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60_000);

    await this.repoAuth.saveOtp({
      email: dto.email,
      code,
      type: 'signup' as OtpType,
      expires_at: expiresAt,
    } as Partial<Otp>);

    await this.otpService.sendOtp(dto.email, code);
  }
}