
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetExpectedPriceSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار',
      example: 12,
    }),
    ApiOkResponse({
      description: 'تم ارجاع السعر المتوقع للعقار',
      schema: {
        example: {
          successful: true,
          message:'تم ارجاع السعر المتوقع للعقار',
          data: { 
            expected_price: 123456,
          },
          status_code: 200,
        },
        type: 'object',

      },
    }),
    ApiUnauthorizedResponse({
      description: 'توكن غير صالح',
      schema: {
        example: {
          successful: false,
          error: 'توكن غير صالح',
          status_code: 401,
        },
      },
    }),
  );
}
