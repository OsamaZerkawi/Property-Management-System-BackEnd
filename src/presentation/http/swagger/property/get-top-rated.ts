
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PropertyType } from 'src/domain/enums/property-type.enum';

export function GetTopRatedPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'جلب العقارات الأعلى تقييماً (بدون الحاجة لتسجيل دخول)' }),

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
      description: 'عدد العناصر في الصفحة (افتراضي = 10)',
    }),

    ApiQuery({
      name: 'type',
      required: true,
      enum: PropertyType,
      description: 'نوع العقار (سكني أو سياحي)',
      example: PropertyType.RESIDENTIAL,
    }),

    ApiOkResponse({
      description: 'تم إرجاع جميع العقارات المميزة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع العقارات المميزة',
          data: [
            {
              id: 23,
              title: 'شي على كيف كيفك',
              image: 'http://localhost:3000/uploads/properties/posts/images/postImage-1750149670293-808554663.bmp',
              location: 'دمشق - ميدان',
              listing_type: 'أجار',
              price: 15000,
              rental_period: 'سنوي',
              is_favorite: 0,
              avg_rate: 3,
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
    })
  );
}