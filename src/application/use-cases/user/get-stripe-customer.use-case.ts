import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";

@Injectable()
export class GetStripeCustomerUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  async execute(userId: number): Promise<string | null> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user.stripe_customer_id;
  }
}
