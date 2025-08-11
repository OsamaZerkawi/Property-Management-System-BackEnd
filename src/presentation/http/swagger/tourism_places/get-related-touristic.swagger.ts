 import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function GetRelatedTouristicSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص تطبيق الموبايل',
      description:
        'يرجع حتى 5 عقارات سياحية ذات صلة بالعقار المحدد (حسب السعر، المنطقة/المحافظة، والتاغ). ' +
        'إذا لم تكن هناك نتائج كافية في نفس المنطقة، يتم البحث في نفس المحافظة كحل بديل.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرّف العقار السياحي المرجعي',
      example: 106,
    }),
    ApiOkResponse({
      description: 'تم جلب العقارات السياحية ذات الصلة بنجاح.',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            propertyId: { type: 'number', example: 209 },
            title: { type: 'string', example: 'فيلا فاخرة على البحر' },
            date: { type: 'string', example: '2025-08-05', description: 'تاريخ النشر بالشكل yyyy-MM-dd' },
            postImage: { type: 'string', example: 'http://localhost:3000/uploads/properties/posts/images/img.jpg', nullable: true },
            pricePerNight: { type: 'string', example: '1000.00', description: 'سعر الليلة أو السعر المعتمد في touristic.price' },
            location: { type: 'string', example: 'دمشق,المزة', description: 'city,region' },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'العقار المرجعي غير موجود أو لا يمتلك بيانات سياحية.',
      schema: {
        example: { statusCode: 404, message: 'العقار السياحي غير موجود' },
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
