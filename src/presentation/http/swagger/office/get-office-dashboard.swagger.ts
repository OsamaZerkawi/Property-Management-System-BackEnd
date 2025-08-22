// presentation/http/decorators/get-office-dashboard.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function GetOfficeDashboardSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description:
        'يعيد ملخص لوحة تحكم صاحب المكتب (معلومات عامة، تقييم المكتب، عدد البلاغات المقبولة، الأرباح، وإحصاءات العقارات). يُستخدم توكن صاحب المكتب للحصول على office_id داخلياً.',
    }),

    ApiOkResponse({
      description: 'تم جلب بيانات لوحة التحكم بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب بيانات المكتب بنجاح',
          data: {
            name: 'مكتب التميز',
            logo: 'http://localhost:3000/uploads/offices/logos/office-logo.png',
            location: 'دمشق، المزة',
            rate: 4.2,
            complaints_count: 3,
            profits: 12500.5,
            touristicCount: 12,
            totalProperties: 34,
            residentialSaleCount: 8,
            residentialRentCount: 14,
          },
          status_code: 200,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'طلب غير صالح.',
      schema: {
        example: {
          successful: false,
          message: 'بيانات الإدخال غير صحيحة',
          status_code: 400,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'المكتب غير موجود.',
      schema: {
        example: {
          successful: false,
          message: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'مستخدم غير مصادق أو التوكن مفقود/غير صالح.',
      schema: {
        example: {
          successful: false,
          message: 'غير مصرح',
          status_code: 401,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ داخلي غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
}
