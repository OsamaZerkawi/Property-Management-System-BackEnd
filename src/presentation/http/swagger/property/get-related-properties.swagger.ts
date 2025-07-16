import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

export function GetRelatedPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),
    
    ApiParam({
      name: 'propertyId',
      required: true,
      type: Number,
      description: 'معرف العقار',
      example: 32,
    }),

    ApiOkResponse({
      description: 'تم ارجاع العقارات ذات صلة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع العقارات ذات صلة',
          data: [
            {
              propertyId: 13,
              postTitle: 'منتجع - 83.92 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/https://picsum.photos/seed/wB3Nl/3886/362?grayscale&blur=3',
              location: 'دمشق, القابون',
              postDate: '2025-07-13',
              is_favorite: 0,
              listing_type: 'بيع',
            },
          ],
          status_code: 200,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'العقار غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد عقار بهذا المعرف',
          status_code: 404,
        },
      },
    }),
  );
}
