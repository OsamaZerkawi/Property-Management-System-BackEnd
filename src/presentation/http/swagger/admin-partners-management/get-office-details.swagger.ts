
// show-office-details.doc.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function GetOfficeDetailsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'جلب تفاصيل مكتب حسب المعرف',
      description: 'يرجع تفاصيل المكتب مثل الشعار، الاسم، النوع، متوسط التقييم، أوقات العمل، رقم الهاتف، وروابط التواصل الاجتماعي.',
    }),
    ApiParam({ name: 'id', description: 'معرف المكتب', required: true, schema: { type: 'number', example: 5 } }),
    ApiOkResponse({
      description: 'تم إرجاع تفاصيل المكتب بنجاح',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 5 },
          logo: { type: 'string', example: 'http://localhost:3000/uploads/offices/logos/logo.png', nullable: true },
          name: { type: 'string', example: 'مكتب المستقبل' },
          type: { type: 'string', example: 'وكالة عقارية' },
          rate: { type: 'number', example: 4.5 },
          opening_time: { type: 'string', example: '09:00' },
          closing_time: { type: 'string', example: '18:00' },
          phone: { type: 'string', example: '0591234567' },
          socials: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                platform: { type: 'string', example: 'facebook' },
                link: { type: 'string', example: 'https://facebook.com/officepage' }
              }
            }
          }
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب غير موجود',
      schema: { example: { statusCode: 404, message: 'المكتب غير موجود' } },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي',
      schema: { example: { statusCode: 500, message: 'حدث خطأ غير متوقع' } },
    }),
  );
}
