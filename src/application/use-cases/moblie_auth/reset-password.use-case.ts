// src/application/use-cases/auth/reset-password.use-case.ts
import { Injectable, NotFoundException,Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from 'src/application/dtos/mobile_auth/reset-password.dto';
import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    // 1) ابحث عن المستخدم بالبريد
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(errorResponse('المستخدم غير موجود', 404));
    }

    // 2) هشّ كلمة المرور الجديدة
    const hashed = await bcrypt.hash(dto.password, 10);

    // 3) حدّث كلمة المرور في قاعدة البيانات
    await this.userRepo.updatePassword(user.id, hashed);
  }
}
