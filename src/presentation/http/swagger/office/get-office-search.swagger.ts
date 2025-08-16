import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

export function GetOfficeSearchSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description:
        'يبحث عن المكاتب العقارية بالاسم',
    }),

    ApiQuery({
      name: 'name',
      required: true,
      type: String,
      example: 'الكسم',
      description: 'نص البحث (اسم المكتب أو جزء منه).',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة (افتراضي = 1).',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر في كل صفحة (افتراضي = 10).',
    }),

    ApiOkResponse({
      description: 'نتائج البحث (قائمة المكاتب المطابقة).',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع نتائج البحث',
          data: [
            {
              officeId: 4,
              name: 'مكتب الهدى للعقارات',
              logo: 'http://localhost:3000/uploads/offices/logos/logo1.png',
              type: 'سكني',
              location: 'دمشق، الميدان',
              rate: 4.8, 
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 1,
            itemsPerPage: 10,
            totalPages: 1,
          },
        },
      },
    }),
  );
}
