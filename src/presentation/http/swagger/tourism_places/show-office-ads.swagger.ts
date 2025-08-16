import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ShowOfficeAdsSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description: 'يرجع مصفوفة من روابط صور الإعلانات الخاصة بمكتب معين إذا كانت مدفوعة ومفعلة وموافقة الإدارة.',
    }),
    ApiParam({ name: 'id', required: true, description: 'معرّف المكتب', schema: { type: 'number', example: 5 } }),
    ApiOkResponse({
      description: 'قائمة روابط صور الإعلانات',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'تم إرجاع صور الإعلانات بنجاح' },
          data: {
            type: 'array',
            items: { type: 'string', example: 'http://localhost:3000/uploads/offices/ads/ad1.jpg' },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب غير موجود',
      schema: { example: { statusCode: 404, message: 'المكتب غير موجود' } },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
      schema: { example: { statusCode: 500, message: 'حدث خطأ غير متوقع' } },
    }),
  );
}
