import { applyDecorators } from "@nestjs/common";
import { 
  ApiBearerAuth, 
  ApiBody, 
  ApiConsumes, 
  ApiForbiddenResponse, 
  ApiNotFoundResponse, 
  ApiOkResponse, 
  ApiParam, 
  ApiUnauthorizedResponse, 
  ApiBadRequestResponse, 
  ApiOperation
} from "@nestjs/swagger";

export function PayInvoiceSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
  ApiOperation({ summary: 'خاص بتطبيق الموبايل' }),
    ApiParam({
      name: 'invoiceId',
      required: true,
      type: Number,
      description: 'معرّف الفاتورة',
      example: 12,
    }),

    ApiConsumes('application/json'),

    ApiBody({
      description: 'بيانات الدفع الخاصة بالفاتورة',
      schema: {
        type: 'object',
        properties: {
          paymentIntentId: {
            type: 'string',
            description: 'المعرف القادم من Stripe (PaymentIntentId)',
            example: 'pi_3OzFg5L5k2Example',
          },
        },
        required: ['paymentIntentId'],
      },
    }),

    ApiOkResponse({
      description: 'تم تسجيل الدفع بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تسجيل الدفع بنجاح',
          data: {},
          status_code: 200,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'أحد الأخطاء التالية قد يحدث',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  successful: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'الفاتورة مدفوعة مسبقاً' },
                  status_code: { type: 'number', example: 400 },
                },
              },
              {
                type: 'object',
                properties: {
                  successful: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'paymentIntentId مطلوب' },
                  status_code: { type: 'number', example: 400 },
                },
              },
            ],
          },
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'الفاتورة غير موجودة',
      schema: {
        example: {
          successful: false,
          error: 'الفاتورة غير موجودة',
          status_code: 404,
        },
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
