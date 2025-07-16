import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

export function GetAllPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

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
      description: 'تم إرجاع جميع العقارات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع العقارات',
          data: [
            {
              propertyId: 13,
              postTitle: 'منتجع - 83.92 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, القابون',
              postDate: '2025-07-13',
              is_favorite: 0,
              listing_type: 'بيع',
              price: 69022091,
            },
            {
              propertyId: 14,
              postTitle: 'معرض - 59.74 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, القابون',
              postDate: '2025-07-12',
              is_favorite: 0,
              listing_type: 'أجار',
              price: 117986,
              rate: 3.7,
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 14,
            itemsPerPage: 10,
            totalPages: 2,
          },
        },
      },
    }),
  );
}
