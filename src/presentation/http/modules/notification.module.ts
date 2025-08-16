import { Module } from "@nestjs/common";
import { FirebaseService } from "src/application/services/firebase.service";
import { NotificationsController } from "../controllers/notification.controller";
import { NOTIFICATION_REPOSITORY } from "src/domain/repositories/notification.repository";
import { NotificationRepository } from "src/infrastructure/repositories/notification.repository";
import { MobileAuthModule } from "./mobile_auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "src/domain/entities/notification.entity";
import { CreateNotificationUseCase } from "src/application/use-cases/notification/create-notification.use-case";
import { ListNotificationsUseCase } from "src/application/use-cases/notification/list-notifications.use-case";
import { MarkNotificationReadUseCase } from "src/application/use-cases/notification/mark-notification-read.use-case";
import { FcmToken } from "src/domain/entities/fcmToken.entity";
import { NotificationProcessor } from "src/infrastructure/queues/notification.processor";
import { BullModule } from "@nestjs/bull";
import { NotificationQueueService } from "src/infrastructure/queues/notificatoin-queue.service";
import { CreateNotificationForTargetUseCase } from "src/application/use-cases/notification/create-notification-for-target.use-case";
import { User } from "src/domain/entities/user.entity";
import { UserModule } from "./user.module";

@Module({
    imports:[
      UserModule,
      MobileAuthModule,
      TypeOrmModule.forFeature([Notification,FcmToken,User]),
    ],
    controllers:[NotificationsController],
    providers:[
      FirebaseService,
      NotificationQueueService,
      CreateNotificationUseCase,
      ListNotificationsUseCase,
      MarkNotificationReadUseCase,
      CreateNotificationForTargetUseCase,
      {
        provide:NOTIFICATION_REPOSITORY,
        useClass:NotificationRepository
      }
    ],
    exports:[
      FirebaseService,
      CreateNotificationUseCase,
      NOTIFICATION_REPOSITORY
    ],
})
export class NotificationModule{}