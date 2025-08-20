import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { SendNotificationDto } from 'src/application/dtos/notification/send-notification.dto';
import { FirebaseService } from 'src/application/services/firebase.service';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/create-notification.use-case';
import { ListNotificationsUseCase } from 'src/application/use-cases/notification/list-notifications.use-case';
import { MarkNotificationReadUseCase } from 'src/application/use-cases/notification/mark-notification-read.use-case';
import { NotificationQueueService } from 'src/infrastructure/queues/notificatoin-queue.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { successResponse } from 'src/shared/helpers/response.helper';
import { GetUserNotificationsSwaggerDoc } from '../swagger/notifications/get-user-notification.swagger';
import { CreateNotificationSwaggerDoc } from '../swagger/notifications/create-notification.swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import { CreateNotificationForTargetUseCase } from 'src/application/use-cases/notification/create-notification-for-target.use-case';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Permissions } from 'src/shared/decorators/permission.decorator';

@Controller('notifications')
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationsController {
  constructor(
    // private readonly
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly markReadUseCase: MarkNotificationReadUseCase,
    private readonly firebaseService: FirebaseService,
    private readonly notificationQueue: NotificationQueueService,
    private readonly createNotificationForTargetUseCase: CreateNotificationForTargetUseCase,
  ) {}

  @Get()
  @GetUserNotificationsSwaggerDoc()
  async getUserNotifications(@CurrentUser() user) {
    const userId = user.sub;
    const notifications = await this.listNotificationsUseCase.execute(userId);

    return successResponse(
      notifications,
      'تم ارجاع جميع الاشعارات الخاصة بك ',
      200,
    );
  }

  @Public()
  @Post('device')
  @HttpCode(HttpStatus.OK)
  async sendToDevice(
    @Body()
    dto: {
      token: string;
      title: string;
      body: string;
      data?: Record<string, any>;
    },
  ) {
    const { token, title, body, data } = dto;

    this.notificationQueue.sendToDevice(token, title, body, data);

    return { message: 'Notification queued successfully 🚀' };
  }

  @Roles('مشرف', 'مدير')
  @Permissions('مراقب النظام')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateNotificationSwaggerDoc()
  async createNotification(
    @CurrentUser() user,
    @Body() body: SendNotificationDto,
  ) {
    const userId = user.sub;
    // const { title, body: notificationBody, data } = body;

    const notification = await this.createNotificationForTargetUseCase.execute(
      userId,
      body,
    );

    return successResponse([], 'تم إنشاء الإشعار وإرساله', 201);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: number) {
    await this.markReadUseCase.execute(id);

    return successResponse([], 'تم تحديث حالة الإشعار على أنه مقروء', 200);
  }
}
