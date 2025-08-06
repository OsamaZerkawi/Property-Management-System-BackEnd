import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function ListTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description: 'يعرض جميع العقارات السياحية المرتبطة بالمكتب الحالي للمستخدم.',
    }),
    ApiOkResponse({
      description: 'قائمة العقارات السياحية',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'شاليه 55م' },
            location: { type: 'string', example: 'دمشق, المزة' },
            area: { type: 'number', example: 150 },
            postImage:{ type: 'string', example: 'http://localhost:3000/uploads/properties/posts/images/url.jpg' },
            price: { type: 'number', example: 300000 },
            status: {
              type: 'string',
              example: 'متوفر',
              description: 'الحالة الحالية للعقار السياحي',
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'لم يتم العثور على مكتب مرتبط بهذا المستخدم.',
      schema: {
        example: { statusCode: 404, message: 'المكتب غير موجود' },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: { statusCode: 500, message: 'حدث خطأ غير متوقع' },
      },
    }),
  );
}
