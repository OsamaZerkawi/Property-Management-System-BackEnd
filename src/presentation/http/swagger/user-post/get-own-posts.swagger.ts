import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

export function GetOwnPostsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاص بتطبيق الجوال' }),
    ApiOkResponse({
      description: 'تم إرجاع منشورات المستخدم بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب جيمع المنشورات الخاصة بك',
          data: [
            {
              id: 5,
              title: 'أبحث عن شقة للإيجار',
              description: 'أحتاج لشقة بغرفتين وصالة قريبة من وسط المدينة',
              type: 'أجار',
              location: 'دمشق, المزة',
              budget: 1200000,
              createdAt: '2025-07-01',
              status: 'قيد الانتظار',
            },
          ],
          status_code: 200,
        },
      },
    })
  );
}
