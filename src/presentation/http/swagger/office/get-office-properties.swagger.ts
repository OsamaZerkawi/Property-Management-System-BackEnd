 import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function GetOfficePropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description:
        'إرجاع قائمة العقارات المرتبطة بمكتب معين مع دعم التصفية حسب النوع والتقسيم إلى صفحات.',
    }),

    ApiParam({
      name: 'officeId',
      type: Number,
      example: 11,
      description: 'معرف المكتب الذي سيتم عرض عقاراته',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة المطلوبة (افتراضي: 1)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العقارات في الصفحة (افتراضي: 10)',
    }),

    ApiQuery({
      name: 'property_type',
      required: false,
      type: String,
      enum: ['عقاري', 'سياحي'],
      example: 'عقاري',
      description: 'نوع العقار للتصفية (اختياري)',
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع العقارات بنجاح',
          page: 1,
          items: 10,
          total: 25,
          data: [
            {
              postImage: 'http://example.com/uploads/properties/posts/images/image.jpg',
              postTitle: 'شقة للبيع في وسط المدينة',
              location: 'دمشق, المزة',
              type: 'عقاري',
              price: 25000000,
            },
          ],
          status_code: 200,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'بيانات غير صالحة.',
      schema: {
        example: {
          successful: false,
          message: 'officeId يجب أن يكون رقماً صحيحاً',
          status_code: 400,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'المكتب غير موجود.',
      schema: {
        example: {
          successful: false,
          message: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
    }),
  );
}
