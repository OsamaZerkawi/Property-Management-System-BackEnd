// src/infrastructure/auth/strategies/local.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { MobileValidateUserUseCase } from 'src/application/use-cases/moblie_auth/validate-user.use-case';

@Injectable()
export class MobileLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUser: MobileValidateUserUseCase) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const user = await this.validateUser.execute(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
