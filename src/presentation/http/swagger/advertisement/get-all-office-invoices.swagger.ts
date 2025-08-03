import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function GetAllOfficeInvoicesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'جلب جميع الإعلانات مع فواتيرها لمكتب المستخدم الحالي',
      description:
        'يرجع جميع الإعلانات المرتبطة بمكتب المستخدم مع معلومات الفاتورة (إن وجدت) وحالة الإعلان.',
    }),
    ApiResponse({
      status: 200,
      description: 'تم إرجاع جميع السجلات الخاصة بالإعلانات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع السجلات الخاصة بالإعلانات ',
          data: {
            invoices: [
              {
                advertisement_id: 1,
                invoice_id: 10,
                paid_date: '2025-07-01',
                type: 'إعلان مدفوع',
                day_period: 3,
                amount: 5000,
                advertisement_status: 'مدفوع',
              },
              {
                advertisement_id: 2,
                invoice_id: null,
                paid_date: null,
                type: null,
                day_period: 'مسائي',
                amount: null,
                advertisement_status: 'قيد الانتظار',
              },
              {
                advertisement_id: 3,
                invoice_id: null,
                paid_date: null,
                type: null,
                day_period: 'مسائي',
                amount: null,
                advertisement_status: 'مرفوض',
              },
            ],
          },
          status_code: 200,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'لا يوجد مكتب مرتبط بالمستخدم',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد مكتب مرتبط بالمستخدم',
          data: null,
          status_code: 404,
        },
      },
    }),
  );
}
