// src/application/use-cases/auth/validate-user.use-case.ts
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  MOBILE_AUTH_REPOSITORY,
  MobileAuthRepositoryInterface
} from 'src/domain/repositories/mobile_auth.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';

@Injectable()
export class MobileValidateUserUseCase {
  constructor(
    @Inject(MOBILE_AUTH_REPOSITORY)
    private readonly authRepo: MobileAuthRepositoryInterface,
  ) {}

  async execute(email: string, password: string) { 
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(errorResponse('User Not Found', 404));
    }
 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        errorResponse('The provided password does not match our records', 401),
      );
    }

    return user;
  }
}
