
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

export function RatePropertySwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال'}),

    ApiParam({
      name: 'propertyId',
      type: Number,
      required: true,
      description: 'معرّف العقار الذي سيتم تقييمه',
      example: 12,
    }),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          rate: {
            type: 'number',
            example: 4.5,
            minimum: 1,
            maximum: 5,
            description: 'قيمة التقييم من 1 إلى 5',
          },
        },
        required: ['rate'],
      },
    }),

    ApiOkResponse({
      description: 'تم تقييم العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تقييم العقار بنجاح',
          data: [],
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
