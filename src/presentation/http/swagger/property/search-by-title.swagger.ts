
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

export function SearchPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بالجوال' }),

    ApiQuery({
      name: 'title',
      required: true,
      type: String,
      example: 'مزرعة',
      description: 'الكلمة المفتاحية للبحث في عنوان الإعلان',
    }),

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
      description: 'تمت عملية البحث بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تمت عملية البحث بنجاح',
          data: [
            {
              propertyId: 13,
              postTitle: 'مزرعة - 83.92 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, القابون',
              postDate: '2025-07-13',
              is_favorite: 0,
              listing_type: 'آجار',
              price: 69022091,
              rate: 4.5,
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
