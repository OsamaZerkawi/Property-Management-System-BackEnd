import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function GetServiceProviderSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'جلب بيانات مزود الخدمة الخاص بالمستخدم',
      description: 'يعيد معلومات مزود الخدمة المرتبط بحساب المستخدم (مستخدم مـصادق).',
    }),
    ApiOkResponse({
      description: 'تم جلب بيانات مزود الخدمة بنجاح',
      schema: {
        example: {
          success: true,
          message: 'تم جلب بيانات مزود الخدمة بنجاح',
          statusCode: 200,
          data: {
            id: 12,
            name: 'مطبخ الشامي',
            phone: '09991234567',
            logo: 'http://localhost:3000/uploads/service-providers/logos/logo.png',
            details: 'وصف مختصر للمزود',
            career: 'RESTAURANT',
            opening_time: '09:00',
            closing_time: '22:00',
            latitude: 33.5138,
            longitude: 36.2765,
            region: { id: 3, name: 'المزة' },
            city: { id: 1, name: 'دمشق' }
          }
        }
      }
    }),
    ApiUnauthorizedResponse({ description: 'مطلوب تسجيل دخول / توكن غير صالح' }),
    ApiNotFoundResponse({ description: 'مزود الخدمة غير موجود للمستخدم' }),
    ApiInternalServerErrorResponse({ description: 'خطأ داخلي في الخادم' }),
  );
}
