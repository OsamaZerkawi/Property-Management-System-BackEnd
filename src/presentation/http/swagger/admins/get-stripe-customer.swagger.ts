import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

export function GetStripeCustomerSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'جلب معرف العميل في Stripe',
      description:
        'يقوم هذا الـ API بجلب stripe_customer_id للمستخدم الحالي بناءً على التوكن (JWT).',
    }),
    ApiResponse({
      status: 200,
      description: 'تم جلب معرف Stripe بنجاح',
      schema: {
        example: {
          success: true,
          message: 'تم جلب معرف Stripe بنجاح',
          statusCode: 200,
          data: {
            stripe_customer_id: '4444444444444444',
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
    ApiResponse({
      status: 404,
      description: 'لم يتم العثور على المستخدم',
      schema: {
        example: {
          success: false,
          message: 'المستخدم غير موجود',
          statusCode: 404,
        },
      },
    }),
  );
}
