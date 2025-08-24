// presentation/http/decorators/create-purchase.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function CreatePurchaseSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء عملية شراء',
      description:
        'إنشاء عملية شراء لعقار سكني وإصدار الفواتير. يتم إرسال البيانات كـ JSON في جسم الطلب.',
    }),

    // الآن نأخذ JSON بدلاً من form-data
    ApiConsumes('application/json'),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          propertyId: {
            type: 'number',
            example: 12,
            description: 'معرّف العقار',
          },
          deposit: {
            type: 'number',
            example: 5000,
            description: 'قيمة العربون (يجب أن تكون أصغر من السعر الإجمالي)',
          },
          totalPrice: {
            type: 'number',
            example: 20000,
            description: 'السعر الإجمالي للعقار',
          },
          paymentIntentId: {
            type: 'string',
            example: 'pi_123456789',
            description: 'معرّف عملية الدفع (اختياري). إذا لم يكن متوفرًا ارسله null أو احذفه',
          },
          installment: {
            type: 'boolean',
            example: true,
            description: 'هل عملية الشراء بالتقسيط؟ (true/false)',
          },
        },
        required: ['propertyId', 'deposit', 'totalPrice', 'installment'],
        example: {
          propertyId: 12,
          deposit: 5000,
          totalPrice: 20000,
          paymentIntentId: 'pi_123456789',
          installment: true
        }
      },
    }),

    ApiCreatedResponse({
      description: 'تم إنشاء عملية الشراء وإصدار الفواتير بنجاح',
    }),
    ApiBadRequestResponse({ 
      schema: {
        example: {
          message: 'العقار محجوز أو غير متاح حالياً',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'مطلوب توكن صالح للوصول',
    }),
  );
}
