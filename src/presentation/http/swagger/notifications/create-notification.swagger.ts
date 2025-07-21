
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SendNotificationDto } from 'src/application/dtos/notification/send-notification.dto';

export function CreateNotificationSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'إنشاء وإرسال إشعار للمستخدم الحالي' }),
    ApiBody({
      type: SendNotificationDto,
      description: 'بيانات الإشعار',
      examples: {
        example1: {
          summary: 'إنشاء إشعار بسيط',
          value: {
            title: 'تنبيه جديد',
            body: 'تم إضافة عنصر جديد في النظام',
            data: { key: 'value' },
            fcmToken: 'optional-fcm-token',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'تم إنشاء الإشعار وإرساله بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إنشاء الإشعار وإرساله',
          data: {},
          status_code: 201,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'بيانات خاطئة أو مفقودة',
      schema: {
        example: {
          successful: false,
          message: 'عنوان الإشعار مطلوب',
          status_code: 400,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'غير مصرح - يجب تسجيل الدخول',
      schema: {
        example: {
          successful: false,
          message: 'Unauthorized',
          status_code: 401,
        },
      },
    }),
  );
}
