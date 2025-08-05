import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function GetPaymentMethodSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description: 'يعيد طريقة الدفع المسجلة للمكتب التابع للمستخدم الحالي.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع طريقة الدفع بنجاح',
      schema: {
        type: 'object',
        properties: {
          successful:   { type: 'boolean', example: true },
          message:      { type: 'string',  example: 'تم ارجاع طريقة الدفع' },
          status_code:  { type: 'number',  example: 200 },
          data: {
            type: 'object',
            properties: {
              paymentMethod: { type: 'string', example: 'كاش' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب غير موجود',
      schema: {
        type: 'object',
        properties: {
          successful:  { type: 'boolean', example: false },
          message:     { type: 'string',  example: 'المكتب غير موجود' },
          status_code: { type: 'number',  example: 404 },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
      schema: {
        type: 'object',
        properties: {
          successful:  { type: 'boolean', example: false },
          message:     { type: 'string',  example: 'حدث خطأ غير متوقع' },
          status_code: { type: 'number',  example: 500 },
        },
      },
    }),
  );
}
