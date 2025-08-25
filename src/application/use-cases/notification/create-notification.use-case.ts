import { Inject, Injectable } from '@nestjs/common';
import { combineLatest } from 'rxjs';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from 'src/domain/repositories/notification.repository';
import { NotificationQueueService } from 'src/infrastructure/queues/notificatoin-queue.service';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: NotificationRepositoryInterface,
    private readonly notificationQueue: NotificationQueueService,
  ) {}

  async execute(userId: number, title: string, body: string,senderName: string,data?: any) {
    const notification = await this.notificationRepo.create({
      userId,
      title,
      body,
      data,
      senderName,
      isRead: false,
      sent_at: new Date(),
    });

    const tokens = await this.notificationRepo.getFcmTokensByUserId(userId);
    if (tokens && tokens.length > 0) {
      // const fullData = {
      //   ...data,
      //   notification_id: notification.id,
      // };

      // هون لازم نلاقي حل اذا كذا توكن
      for (const token of tokens) {
        this.notificationQueue.sendToDevice(token, title, body);
      }
    }

    return notification;
  }
}
