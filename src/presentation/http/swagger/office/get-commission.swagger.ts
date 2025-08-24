// src/swagger/commission.swagger.ts
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CommissionSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description:
        'هذه الواجهة تقوم بإرجاع قيمة العمولة الخاصة بالمكتب العقاري المرتبط بالمستخدم المصادق عليه.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم إرجاع عمولة المكتب بنجاح',
      schema: {
        example: {
          success: true,
          statusCode: 200,
          message: 'تم ارجاع عمولة المكتب',
          data: {
            commission: 0.1,
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'أحد الأخطاء التالية قد تحدث:',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                example: {
                  success: false,
                  statusCode: 401,
                  message: 'لم يتم إرسال بيانات التفويض',
                  error: 'Unauthorized',
                  data: null,
                },
              },
              {
                example: {
                  success: false,
                  statusCode: 401,
                  message: 'تنسيق التوكن غير صالح',
                  error: 'Unauthorized',
                  data: null,
                },
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'لا يوجد مكتب مرتبط بالمستخدم الحالي',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'لا يوجد مكتب عقاري خاص بك',
          error: 'Not Found',
          data: null,
        },
      },
    }),
  );
}
