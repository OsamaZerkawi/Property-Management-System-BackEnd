 
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function SearchByTitleSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description: 'يرجع قائمة عقارات سياحية تطابق عنوانها كلمة البحث، (pagination).',
    }),

    ApiQuery({ name: 'title', required: true, type: String, description: 'كلمة البحث في عنوان العقار' }),
    ApiQuery({ name: 'page',   required: false, type: Number, description: 'رقم الصفحة الحالية', example: 1 }),
    ApiQuery({ name: 'items',  required: false, type: Number, description: 'عدد العناصر في الصفحة', example: 10 }),

    ApiOkResponse({
      description: 'نتائج البحث مع بيانات الترقيم',
      schema: {
        type: 'object',
        properties: {
          successful: { type: 'boolean', example: true },
          message:    { type: 'string', example: 'تم ارجاع العقارات السياحية بنجاح' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                propertyId: { type: 'number', example: 1 },
                location:   { type: 'string', example: 'دمشق, المزة' },
                postImage:  { type: 'string', example: 'https://example.com/image.jpg' },
                title:      { type: 'string', example: 'شاليه 55م' },
                price:      { type: 'number', example: 300000, nullable: true },
              },
              required: ['propertyId', 'location', 'postImage', 'title'],
            },
          },
          status_code: { type: 'number', example: 200 },
          pagination: {
            type: 'object',
            properties: {
              currentPage:  { type: 'number', example: 1 },
              totalItems:   { type: 'number', example: 9 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages:   { type: 'number', example: 1 },
            },
            required: ['currentPage', 'totalItems', 'itemsPerPage', 'totalPages'],
          },
        },
        required: ['successful', 'message', 'data', 'status_code', 'pagination'],
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
      schema: {
        example: { statusCode: 500, message: 'حدث خطأ غير متوقع' },
      },
    }),
  );
}
