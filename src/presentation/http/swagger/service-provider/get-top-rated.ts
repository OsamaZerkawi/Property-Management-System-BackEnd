
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

export function GetTopRatedServiceProvidersSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'جلب مقدمي الخدمات الأعلى تقييماً (بدون تسجيل دخول)' }),

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
      description: 'تم جلب مقدمي الخدمات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب مقدمي الخدمات بنجاح',
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
