
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function GetUserNotificationsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(), 
    ApiOperation({ summary: 'جلب جميع الإشعارات الخاصة بالمستخدم الحالي' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم ارجاع جميع الاشعارات الخاصة بك',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع الاشعارات الخاصة بك',
          data: [
            {
              id: 1,
              title: 'تمت الموافقة على إعلانك',
              body: 'يمكنك الآن إتمام عملة الدفع لتغيل الإعلان',
              isRead: false,
              sent_at: '2025-07-14',
              data: {
                adId: 1,
              },
            },
          ],
          status_code: 200,
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
