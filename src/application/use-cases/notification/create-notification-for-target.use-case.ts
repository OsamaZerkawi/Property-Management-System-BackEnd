import { Inject, Injectable } from '@nestjs/common';
import { SendNotificationDto } from 'src/application/dtos/notification/send-notification.dto';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from 'src/domain/repositories/notification.repository';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';
import { NotificationQueueService } from 'src/infrastructure/queues/notificatoin-queue.service';

@Injectable()
export class CreateNotificationForTargetUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifcaitonRepo: NotificationRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
    private readonly notificationQueue: NotificationQueueService,
  ) {}

  async execute(userId: number, data: SendNotificationDto) {
    const users = await this.userRepo.getTargetUsers(data.target);

    if (!users.length) return;

    const notifications = users.map((user) =>
      this.notifcaitonRepo.createAndSave({
        userId: user.id,
        title: data.title,
        body: data.body,
        senderId: userId,
        sent_at: new Date(),
      }),
    );

    for (const user of users) {
      if (user.fcmTokens?.length) {
        for (const token of user.fcmTokens) {
          await this.notificationQueue.sendToDevice(
            token.fcmToken,
            data.title,
            data.body,
          );
        }
      }
    }
  }
}
