import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

export function RemoveFavoriteSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiParam({
      name: 'propertyId',
      required: true,
      description: 'معرف العقار الذي سيتم إزالته من المفضلة',
      example: 13,
    }),

    ApiResponse({
      status: 200,
      description: 'تم إزالة العقار من المفضلة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إزالة هذا العقار من المفضلة',
          data: [],
          status_code: 200,
        },
      },
    }),

    ApiResponse({
      status: 404,
      description: 'العقار غير موجود في المفضلة',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد هذا العقار في المفضلة',
          status_code: 404,
        },
      },
    }),
  );
}
