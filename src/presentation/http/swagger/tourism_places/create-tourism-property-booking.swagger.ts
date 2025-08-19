import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function CreateTouristicBookingSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاص بتطبيق الموبايل' }),

    ApiConsumes('application/json'),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date', example: '2025-08-20' },
          endDate: { type: 'string', format: 'date', example: '2025-08-25' },
          propertyId: { type: 'number', example: 12 },
          deposit: { type: 'number', example: 200 },
          totalPrice: { type: 'number', example: 1000 },
          payment_id: { type: 'string', example: 'PAY-654321' },
        },
        required: [
          'startDate',
          'endDate',
          'propertyId',
          'deposit',
          'totalPrice',
          'payment_id',
        ],
      },
    }),

    ApiOkResponse({ schema: { example: { message: 'تم إنشاء الحجز والفواتير بنجاح' } } }),
    ApiBadRequestResponse({
      schema: { example: { message: 'بيانات غير صالحة' } },
    }),
    ApiInternalServerErrorResponse({
      schema: { example: { message: 'حدث خطأ في الخادم' } },
    }),
  );
}
