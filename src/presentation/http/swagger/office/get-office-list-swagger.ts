import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

export function GetOfficeListSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description: 'API لعرض المكاتب العقارية مع الشعار، النوع، الموقع، ومتوسط التقييم، مع دعم التصفح بالصفحات (Pagination).',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة المطلوبة (افتراضي = 1)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر في كل صفحة (افتراضي = 10)',
    }),

    ApiOkResponse({
      description: 'تم جلب قائمة المكاتب العقارية بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع قائمة المكاتب',
          data: [
            {
              officeId: 4,
              name: 'مكتب الهدى للعقارات',
              logo: 'http://localhost:3000/uploads/offices/logos/logo1.png',
              type: 'سكني',
              location: 'دمشق، ميدان',
              rate: 5,
            },
            {
              officeId: 3,
              name: 'مكتب العمران',
              logo: 'http://localhost:3000/uploads/offices/logos/logo2.png',
              type: 'سياحي',
              location: 'دمشق، باب توما',
              rate: 3.5,
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 20,
            itemsPerPage: 10,
            totalPages: 2,
          },
        },
      },
    }),
  );
}
