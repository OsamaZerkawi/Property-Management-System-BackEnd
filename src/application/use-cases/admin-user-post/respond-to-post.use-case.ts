import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespondToAdRequestDto } from 'src/application/dtos/advertisement/respond-to-ad-request.dto';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';
import {
  USER_POST_REPOSITORY,
  UserPostRepositoryInterface,
} from 'src/domain/repositories/user-post.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { CreateNotificationUseCase } from '../notification/create-notification.use-case';
import { UserPost } from 'src/domain/entities/user-post.entity';

@Injectable()
export class RespondToUserPostUseCase {
  constructor(
    @Inject(USER_POST_REPOSITORY)
    private readonly userPostRepo: UserPostRepositoryInterface,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  async execute(id: number, data: RespondToAdRequestDto) {
    const userPost = await this.userPostRepo.findById(id);
    
    if (!userPost) {
      throw new NotFoundException(
        errorResponse('لا يوجد منشور لهذا المعرف', 404),
      );
    }

    if (data.approved) {
      await this.userPostRepo.update(id, {
        status: UserPostAdminAgreement.ACCEPTED,
      });
      await this.createNotificationUseCase.execute(
        userPost.user.id,
        `المنشور ${userPost.title}`,
        'تم قبول طلب منشورك',
      );
    } else {
      await this.userPostRepo.update(id, {
        status: UserPostAdminAgreement.REJECTED,
      });

      await this.createNotificationUseCase.execute(
        userPost.user.id,
        `المنشور ${userPost.title}`,
        'تم رفض طلب منشورك'
      )
    }
  }
}
