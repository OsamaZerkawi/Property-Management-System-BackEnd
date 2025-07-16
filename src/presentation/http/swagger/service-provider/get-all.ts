
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

export function GetAllServiceProvidersSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال والداش تبع المكتب' }),

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
      description: 'تم ارجاع جميع مكاتب مزودي الخدمات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع مكاتب مزودي الخدمات',
          data: [
            {
              id: 1,
              name: 'أب محمود',
              logo: 'http://localhost:3000/uploads/providers/logoصورة ',
              career: 'مصمم ديكور',
              location: 'دمشق, جوبر',
              userPhone: '0935917557',
              avgRate: 4,
              ratingCount: 1
            }
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 1,
            itemsPerPage: 1,
            totalPages: 1
          }
        }
      }
    })
  );
}