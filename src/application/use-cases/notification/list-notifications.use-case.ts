import { Inject, Injectable } from "@nestjs/common";
import { NOTIFICATION_REPOSITORY, NotificationRepositoryInterface } from "src/domain/repositories/notification.repository";

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryInterface
  ) {}

  async execute(userId: number) {
    const notifications =  await this.notificationRepository.findByUser(userId);

    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      sent_at: notification.sent_at?.toISOString().slice(0, 10), 
      data: notification.data || null,
    }));
  }
}