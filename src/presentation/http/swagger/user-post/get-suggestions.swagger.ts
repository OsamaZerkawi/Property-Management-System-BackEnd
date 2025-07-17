import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
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

    ApiOkResponse({
      description: 'تم جلب اقتراحات العقارات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب اقتراحات العقارات بنجاح',
          data: [
            {
              property_id: 101,
              image: 'http://localhost:3000/uploads/properties/posts/images/propertyImage-01.jpg',
              title: 'شقة فاخرة للإيجار',
              location: 'دمشق - المزة',
              price: 150000,
              rate: 4.5,
            },
            {
              property_id: 102,
              image: 'http://localhost:3000/uploads/properties/posts/images/propertyImage-02.jpg',
              title: 'منزل للبيع مع إطلالة',
              location: 'حلب - الفرقان',
              price: 9000000,
            },
          ],
          status_code: 200,
        },
      },
    })
  );
}
