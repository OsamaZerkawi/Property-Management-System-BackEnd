import { Inject, Injectable } from "@nestjs/common";
import { NOTIFICATION_REPOSITORY, NotificationRepositoryInterface } from "src/domain/repositories/notification.repository";

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryInterface
  ) {}

  async execute(id: number) {
    await this.notificationRepository.markAsRead(id);
  }
}