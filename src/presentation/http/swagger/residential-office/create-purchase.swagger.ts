 
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function CreatePurchaseSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء عملية شراء',
      description:
        'يقوم بإنشاء عملية شراء جديدة لمستخدم معين وإصدار الفواتير الخاصة بها.',
    }),
    ApiConsumes('multipart/form-data'),
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
            description: 'معرّف عملية الدفع (اختياري)',
          },
          installment: {
            type: 'boolean',
            example: true,
            description: 'هل عملية الشراء بالتقسيط؟',
          },
        },
        required: ['propertyId', 'deposit', 'totalPrice', 'installment'],
      },
    }),
    ApiCreatedResponse({
      description: 'تم إنشاء عملية الشراء وإصدار الفواتير بنجاح',
    }),
    ApiBadRequestResponse({
      description: 'فشل في التحقق من صحة البيانات (مثلاً: قيمة العربون أكبر من السعر الإجمالي)',
    }),
  );
}
