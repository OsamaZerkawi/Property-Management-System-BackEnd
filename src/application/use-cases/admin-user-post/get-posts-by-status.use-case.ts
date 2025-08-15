import { Inject, Injectable } from '@nestjs/common';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from 'src/domain/repositories/user-post.repository';

@Injectable()
export class GetPostsByStatusUseCase {
  constructor(
    @Inject(USER_POST_REPOSITORY)
    private readonly userPostRepo: UserPostRepositoryInterface,
  ) {}

  async execute(status: UserPostAdminAgreement){
    return await this.userPostRepo.getPostsByStatus(status);
  }
}
