import { Inject, Injectable } from "@nestjs/common";
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

    const tokens = await this.notificationRepo.getFcmTokensByUserId(userId);
    
    if (tokens.length > 0) {
      const fullData = {
        ...data,
        notification_id: notification.id,
      };

      this.notificationQueue.sendToDevices(tokens, title, body, fullData);
    }

    return notification;
  }
}