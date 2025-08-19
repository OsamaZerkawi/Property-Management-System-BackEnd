import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function GetTouristicAvailabilitySwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description:
        'يرجع قائمة أيام (15 يومًا ابتداءً من اليوم الحالي) مع حالة كل يوم (محجوز | متوفر)، وعدد الأيام المتوفرة، وسعر الإيجار اليومي، والعربون والعمولة الخاصة بالمكتب.',
    }),

    ApiParam({
      name: 'propertyId',
      required: true,
      description: 'معرّف العقار السياحي',
      example: 79,
      type: Number,
    }),

    ApiOkResponse({
      description: 'تم جلب تقويم التوفر بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب التقويم بنجاح',
          data: {
            days: [
              { date: '18-8-2025', status: 'متوفر' },
              { date: '19-8-2025', status: 'محجوز' },
              { date: '20-8-2025', status: 'منتهي' }, 
            ],
            availableCount: 11,
            price: 1000,
            deposit: 200,
            commission: 5,
            // periodStart: '18-8-2025',
            // periodEnd: '1-9-2025',
          },
          status_code: 200,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'طلب غير صالح (مثال: propertyId غير صالح).',
      schema: {
        example: {
          successful: false,
          message: 'propertyId يجب أن يكون رقماً صحيحاً',
          status_code: 400,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'العقار أو بياناته غير موجودة',
      schema: {
        example: {
          successful: false,
          message: 'العقار غير موجود',
          status_code: 404,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
}
