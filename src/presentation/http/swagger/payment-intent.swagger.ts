import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiBody, 
  ApiCreatedResponse, 
  ApiUnauthorizedResponse, 
  ApiInternalServerErrorResponse, 
  ApiBearerAuth,
  ApiConsumes
} from '@nestjs/swagger';

export function CreatePaymentIntentSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاص بتطبيق الموبايل' }),
    ApiConsumes('application/x-www-form-urlencoded'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 5000, description: 'المبلغ المطلوب' },
        },
        required: ['amount'],
      },
    }),
    ApiCreatedResponse({
      description: 'تم إنشاء عملية الدفع بنجاح',
      schema: {
        type: 'object',
        properties: {
          clientSecret: { type: 'string', example: 'pi_12345_secret_67890' },
          paymentId: { type: 'string', example: 'pi_12345' },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'لم يتم المصادقة - يجب تسجيل الدخول' }),
    ApiInternalServerErrorResponse({ description: 'حدث خطأ في الخادم أثناء إنشاء العملية' }),
  );
}
