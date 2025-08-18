
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetProfileUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}
 
  async execute(userId: number, baseUrl: string) {
    const user = await this.userRepo.findUserInfoById(userId);
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
 
    const photoUrl = user.photo
      ? `${baseUrl}/uploads/profile/${user.photo}`
      : null; 
      
    return {
    first_name: user.first_name,
    last_name:  user.last_name,
    email:      user.email,
    phone:      user.phone,
    photo_url:  photoUrl,
  };
  }
}