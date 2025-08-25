import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

export function CreateRentalRequestSwagger() {
  return applyDecorators( 
    ApiOperation({ summary: 'خاص بتطبيق الموبايل' }),
    ApiBearerAuth(), 
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          propertyId: {
            type: 'number',
            description: 'معرف العقار الذي سيتم استئجاره',
            example: 3,
          },
          periodCount: {
            type: 'number',
            description: 'عدد الأشهر او السنين',
            example: 6,
          },
          totalPrice: {
            type: 'number',
            description: 'السعر الإجمالي للإيجار للفترة المطلوبة',
            example: 1500.50,
          },
          paymentIntentId: {
            type: 'string',
            description: 'معرف الدفع من Stripe ',
            example: 'pi_1Nxxxxxxx',
          },
        },
        required: ['propertyId', 'periodCount', 'totalPrice','paymentIntentId'],
      },
    }),
    ApiResponse({ status: 201, description: 'تم إنشاء عقد الإيجار والفواتير بنجاح' }),
    ApiResponse({ status: 400, description: 'المستخدم غير مصادق أو بيانات خاطئة' }),
    ApiResponse({ status: 401, description: 'غير مصرح' }),
  );
}
