
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetGlobalInfoUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}
 
  async execute(userId: number, baseUrl: string) {
    const user = await this.userRepo.findGlobalInfoById(userId);
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    const fullName = `${user.first_name} ${user.last_name}`; 
    const photo_url = user.photo
      ? `${baseUrl}/uploads/profile/${user.photo}`
      : null; 
    return { fullName, phone: user.phone, photo_url };
  }
}