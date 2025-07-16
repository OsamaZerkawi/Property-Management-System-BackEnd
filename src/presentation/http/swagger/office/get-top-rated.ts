import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

export function GetTopRatedOfficesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال'}),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة (افتراضي = 1)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر لكل صفحة (افتراضي = 10)',
    }),

    ApiOkResponse({
      description: 'تم جلب المكاتب بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب المكاتب بنجاح',
          data: [
            {
              id: 4,
              name: 'هادي',
              logo: 'http://localhost:3000/uploads/offices/logos/لوغو',
              type: 'سكني',
              location: 'دمشق, ميدان',
              rate: 5,
              rating_count: 1,
            },
            {
              id: 3,
              name: 'حسن',
              logo: 'http://localhost:3000/uploads/offices/logos/لوغو',
              type: 'سكني',
              location: 'دمشق, ميدان',
              rate: 3.5,
              rating_count: 2,
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 2,
            itemsPerPage: 10,
            totalPages: 1,
          },
        },
      },
    })
  );
}