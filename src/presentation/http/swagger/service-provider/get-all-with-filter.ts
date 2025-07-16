
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ServiceProviderType } from 'src/domain/enums/service-provider-type.enum';

export function GetAllServiceProvidersWithFiltersSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال والداش تبع المكتب'}),

    ApiQuery({
      name: 'regionId',
      required: false,
      type: Number,
      example: 1,
      description: 'معرف المنطقة (اختياري)',
    }),

    ApiQuery({
      name: 'cityId',
      required: false,
      type: Number,
      example: 10,
      description: 'معرف المدينة (اختياري)',
    }),

    ApiQuery({
      name: 'career',
      required: false,
      enum: ServiceProviderType,
      example: ServiceProviderType.INTERIOR_DESIGNER,
      description: 'نوع المهنة (اختياري)',
      type: String,
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
      description: 'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع مكاتب مزودي الخدمات مفلترة',
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
