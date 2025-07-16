import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

export function AddFavoriteSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiParam({
      name: 'propertyId',
      required: true,
      description: 'معرف العقار الذي سيتم إضافته إلى المفضلة',
      example: 13,
    }),

    ApiResponse({
      status: 201,
      description: 'تم إضافة العقار إلى المفضلة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم اضافة العقار إلى المفضلة',
          data: [],
          status_code: 201,
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'العقار موجود بالفعل في المفضلة',
      schema: {
        example: {
          successful: false,
          message: 'العقار موجود بالفعل في المفضلة',
          status_code: 400,
        },
      },
    }),

    ApiResponse({
      status: 404,
      description: 'العقار غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'العقار غير موجود',
          status_code: 404,
        },
      },
    }),
  );
}
