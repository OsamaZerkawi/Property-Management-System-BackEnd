import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class UpdateStripeCustomerUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  async execute(userId: number, stripeCustomerId: string) {
    await this.userRepo.update(userId, {
      stripe_customer_id: stripeCustomerId,
    });
  }
}
