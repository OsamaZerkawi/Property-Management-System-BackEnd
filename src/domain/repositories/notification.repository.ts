import { Notification } from "../entities/notification.entity";

export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';

export interface NotificationRepositoryInterface {
    create(notifiactionData: Partial<Notification>);
    findByUser(userId: number);
    markAsRead(id: number);
    getFcmTokensByUserId(userId: number);
    getFcmTokenByUserId(userId: number);
    createAndSave(notification: Partial<Notification>)
}