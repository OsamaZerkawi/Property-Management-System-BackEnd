import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/create-notification.use-case';
import { UserPostSuggestion } from 'src/domain/entities/user-post-suggestions.entity';
import {
  PROPERTY_REPOSITORY,
  PropertyRepositoryInterface,
} from 'src/domain/repositories/property.repository';
import { UserPostSuggestionRepositoryInterface } from 'src/domain/repositories/user-post-suggestion.repository';
import {
  USER_POST_REPOSITORY,
  UserPostRepositoryInterface,
} from 'src/domain/repositories/user-post.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { Not, Repository } from 'typeorm';

export class UserPostSuggestionRepository
  implements UserPostSuggestionRepositoryInterface
{
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
    @Inject(USER_POST_REPOSITORY)
    private readonly userPostRepo: UserPostRepositoryInterface,
    @InjectRepository(UserPostSuggestion)
    private readonly userPostSuggestionRepo: Repository<UserPostSuggestion>,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  async suggestPropertyToUserPost(propertyId: number, userPostId: number) {
    const property = await this.propertyRepo.findByIdWithOwner(propertyId);

    if (!property) {
      throw new NotFoundException(
        errorResponse('لا يوجد عقار لهذا المعرف', 404),
      );
    }

    const userPost = await this.userPostRepo.findById(userPostId);

    if (!userPost) {
      throw new NotFoundException(
        errorResponse('لا يوجد منشور لهذا المعرف', 404),
      );
    }

    const suggestProperty = await this.userPostSuggestionRepo.create({
      property,
      userPost,
    });

    await this.createNotificationUseCase.execute(
      userPost.user.id,
      'اقتراح عقار مناسب',
      `تم اقتراح ${property.post.title} مناسب لمتطلباتك`,
      'صاحب مكتب',
    );

    return await this.userPostSuggestionRepo.save(suggestProperty);
  }
}
