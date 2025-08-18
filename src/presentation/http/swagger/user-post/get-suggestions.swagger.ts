import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export function GetUserPostSuggestionsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiParam({
      name: 'id',
      required: true,
      type: Number,
      description: 'معرف منشور المستخدم (User Post ID)',
      example: 12,
    }),

    ApiQuery({
      name: 'page',
      required: true,
      type: Number,
      description: 'رقم الصفحة ',
      example: 1,
    }),

    ApiQuery({
      name: 'items',
      required: true,
      type: Number,
      description: 'عدد العقارات في الصفحة الواحدة',
      example: 10,
    }),

    ApiOkResponse({
      description: 'تم جلب اقتراحات العقارات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب اقتراحات العقارات بنجاح',
          data: [
            {
              propertyId: 1,
              postTitle: 'محل تجاري 180.05 م²',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/property.png',
              location: 'حلب, الأنصاري',
              postDate: '2025-08-17',
              is_favorite: 0,
              listing_type: 'بيع',
              price: 133059,
              area: 180,
            },
            {
              propertyId: 2,
              postTitle: 'روف 208.22 م²',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/property.png',
              location: 'حلب, الأنصاري',
              postDate: '2025-08-17',
              is_favorite: 0,
              listing_type: 'بيع',
              price: 509543,
              area: 208,
            },
            {
              propertyId: 3,
              postTitle: 'مخزن 212.62 م²',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/property.png',
              location: 'حلب, الأنصاري',
              postDate: '2025-08-17',
              is_favorite: 0,
              type: 'عقاري',
              listing_type: 'أجار',
              rental_period: 'شهري',
              price: 1714,
              rate: 2,
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
