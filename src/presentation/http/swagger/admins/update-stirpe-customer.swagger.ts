
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

export function UpdateStripeCustomerSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'تحديث معرف العميل في Stripe',
      description:
        'يقوم هذا الـ API بتحديث stripe_customer_id للمستخدم الحالي بناءً على التوكن (JWT).',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          stripe_customer_id: {
            type: 'string',
            example: 'cus_Nz9x4l8J7a2f3B', // مثال من Stripe
            description: 'معرف العميل في Stripe',
          },
        },
        required: ['stripe_customer_id'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'تم تعديل تفاصيل البطاقة بنجاح',
      schema: {
        example: {
          success: true,
          message: 'تم تعديل تفاصيل البطاقة بنجاح',
          statusCode: 200,
          data: [],
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'خطأ في التحقق من البيانات',
      schema: {
        example: {
          success: false,
          message: 'stripe_customer_id يجب ألا يكون فارغًا',
          statusCode: 400,
          errors: {
            stripe_customer_id: [
              'stripe_customer_id يجب ألا يكون فارغًا',
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'غير مصرح لك بالوصول (التوكن غير صالح)',
      schema: {
        example: {
          success: false,
          message: 'غير مصرح لك',
          statusCode: 401,
        },
      },
    }),
  );
}
