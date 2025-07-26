
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

export function GetPromotedPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'إرجاع العقارات المروجة - خاصة بتطبيق الجوال' }),

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
      description: 'عدد العناصر في كل صفحة (افتراضي = 10)',
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات المروجة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع العقارات المروجة',
          data: [
            {
              propertyId: 5,
              postTitle: 'شقة مفروشة - 120 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, المزة',
              postDate: '2025-07-25',
              is_favorite: 1,
              listing_type: 'أجار',
              rental_period: 'شهري',
              price: 200000,
              rate: 4.5,
            },
            {
              propertyId: 8,
              postTitle: 'فيلا فاخرة - 300 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, يعفور',
              postDate: '2025-07-20',
              is_favorite: 0,
              listing_type: 'بيع',
              price: 350000000,
              area: 300,
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
    }),
  );
}
