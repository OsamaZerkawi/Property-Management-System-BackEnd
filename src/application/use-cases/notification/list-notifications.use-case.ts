import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from 'src/domain/repositories/notification.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryInterface,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(userId: number) {
    const notifications = await this.notificationRepository.findByUser(userId);

    return notifications.map((notification) => {
      const senderRole =
        notification.sender?.userRoles?.length > 0
          ? notification.sender.userRoles[0].role.name
          : null;

      return {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        name: senderRole,
        // isRead: notification.isRead,
        sent_at: notification.sent_at?.toISOString().slice(0, 10),
      };
    });
  }
}
