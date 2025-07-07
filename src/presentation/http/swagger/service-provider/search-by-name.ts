
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

export function SearchServiceProvidersSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'البحث عن مكاتب مزودي الخدمات' }),

    ApiQuery({
      name: 'name',
      required: true,
      type: String,
      description: 'اسم المزود المراد البحث عنه',
      example: 'أب محمود',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة (اختياري)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر في الصفحة (اختياري)',
    }),

    ApiOkResponse({
      description: 'تم ارجاع نتائج البحث لمزودي الخدمات',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع مكاتب مزودي الخدمات',
          data: [
            {
              id: 1,
              name: 'أب محمود',
              logo: 'http://localhost:3000/uploads/service-providers/logos/صورة',
              career: 'مصمم ديكور',
              location: 'دمشق, جوبر',
              rate: 4,
              rating_count: 1,
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
