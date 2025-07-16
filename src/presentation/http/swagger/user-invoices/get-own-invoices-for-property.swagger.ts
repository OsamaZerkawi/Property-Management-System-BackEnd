import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function GetOwnInvoicesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
    }),

    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار (العقد)',
      example: 1,
      required: true,
    }),

    ApiOkResponse({
      description: 'تم ارجاع جميع الفواتير المتعلقة بهذا العقد بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع الفواتير المتعلقة بهذا العقد',
          data: {
            previous: [
              {
                id: 5,
                date: '2025-06-01',
                reason: 'أجار شهري',
                payment_method: 'دفع يدوي',
                amount: 15000,
                status: 'تم الدفع',
                invoiceImage: 'http://localhost:3000/uploads/invocies/user/صورة ',
              },
              {
                id: 1,
                date: '2025-05-01',
                reason: 'أجار شهري',
                payment_method: 'دفع يدوي',
                amount: 15000,
                status: 'تم الدفع',
                invoiceImage: 'http://localhost:3000/uploads/invocies/user/صورة ',
              },
            ],
            current: [
              {
                id: 4,
                reason: 'أجار شهري',
                amount: 15000,
                status: 'لم يتم الدفع',
                deadline: '2025-09-30',
              },
              {
                id: 3,
                reason: 'أجار شهري',
                amount: 15000,
                status: 'قيد الانتظار',
                deadline: '2025-09-30',
              },
              {
                id: 2,
                reason: 'أجار شهري',
                amount: 15000,
                status: 'قيد الانتظار',
                deadline: '2025-09-30',
              },
            ],
          },
          status_code: 200,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'غير مصرح - يجب تسجيل الدخول',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
}
