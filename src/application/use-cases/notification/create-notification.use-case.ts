import { Inject, Injectable } from "@nestjs/common";
import { combineLatest } from "rxjs";
import { NOTIFICATION_REPOSITORY, NotificationRepositoryInterface } from "src/domain/repositories/notification.repository";
import { NotificationQueueService } from "src/infrastructure/queues/notificatoin-queue.service";

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: NotificationRepositoryInterface,
    private  readonly notificationQueue: NotificationQueueService,
  ){}

  async execute(
    userId: number,
    title: string,
    body: string,
    data?: any,
  ) 
  {
    const notification = await this.notificationRepo.create({
      userId,
      title,
      body,
      data,
      isRead: false,
      sent_at: new Date(),
    });

    const token = await this.notificationRepo.getFcmTokensByUserId(userId);
    
    if (token) {
      // const fullData = {
      //   ...data,
      //   notification_id: notification.id,
      // };

      this.notificationQueue.sendToDevice(token, title, body);
    }

    return notification;
  }
}