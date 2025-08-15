import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RespondToAdRequestDto } from 'src/application/dtos/advertisement/respond-to-ad-request.dto';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from 'src/domain/repositories/notification.repository';
import {
  PROPERTY_POST_REPOSITORY,
  PropertyPostRepositoryInterface,
} from 'src/domain/repositories/property-post.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';

@Injectable()
export class RespondToPropertyPostUseCase {
  constructor(
    @Inject(PROPERTY_POST_REPOSITORY)
    private readonly propertyPostRepo: PropertyPostRepositoryInterface,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: NotificationRepositoryInterface,
  ) {}

  async execute(id: number, data: RespondToAdRequestDto) {
    const propertyPost = await this.propertyPostRepo.findById(id);
    if (!propertyPost) {
      throw new NotFoundException(
        errorResponse('لا يوجد منشور لعقار بهذا المعرف', 404),
      );
    }

    let message;
    if (data.approved) {
      await this.propertyPostRepo.update(id, {
        status: PropertyPostStatus.APPROVED,
      });
      message = 'تم قبول منشور عقارك';
    } else {
      await this.propertyPostRepo.update(id, {
        status: PropertyPostStatus.REJECTED,
      });
      message = 'تم رفض منشور عقارك';
    }

    const userId = propertyPost.property.office.user.id;

    await this.notificationRepo.create({
      userId,
      title: `المنشور - ${propertyPost.title}`,
      body: message,
      sent_at: new Date(),
    });
  }
}
