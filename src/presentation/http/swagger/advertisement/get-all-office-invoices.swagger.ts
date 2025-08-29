import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ServiceType } from 'src/domain/enums/service-type.enum';

export function GetAllOfficeInvoicesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiQuery({
      name: 'type',
      required: false,
      enum: ServiceType,
      description: 'نوع الإعلان (صوري أو ترويجي)',
    }),
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
                type: 'إعلان صوري',
                day_period: 3,
                amount: 5000,
                advertisement_status: 'مدفوع',
                stripeUrl:'https://checkout.stripe.com/c/pay/cs_test_a1X7ZFybeOXuAEk7Qj8PYbU6SztC8zMACa3gha92vF3TWDx13IiJOa1dxQ#fidkdWxOYHwnPyd1blpxYHZxWjA0V1dSVFw1M0EzQ2hzQlExYXRSNUQ2MXxNMTBIUUxBYDFtc2BPNH19NHB3clVANlVPRzNwcWJJcVxDdWNTZjRQaUxzYDBAYHdWMTBERHxrMm1gajRPN3MyNTVTVEh%2Fd3BdSCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
              },
              {
                advertisement_id: 2,
                invoice_id: null,
                paid_date: null,
                type: null,
                day_period: 'مسائي',
                amount: null,
                advertisement_status: 'قيد الانتظار',
                stripeUrl:'https://checkout.stripe.com/c/pay/cs_test_a1X7ZFybeOXuAEk7Qj8PYbU6SztC8zMACa3gha92vF3TWDx13IiJOa1dxQ#fidkdWxOYHwnPyd1blpxYHZxWjA0V1dSVFw1M0EzQ2hzQlExYXRSNUQ2MXxNMTBIUUxBYDFtc2BPNH19NHB3clVANlVPRzNwcWJJcVxDdWNTZjRQaUxzYDBAYHdWMTBERHxrMm1gajRPN3MyNTVTVEh%2Fd3BdSCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'

              },
              {
                advertisement_id: 3,
                invoice_id: null,
                paid_date: null,
                type: null,
                day_period: 'مسائي',
                amount: null,
                advertisement_status: 'مرفوض',
                stripeUrl:'https://checkout.stripe.com/c/pay/cs_test_a1X7ZFybeOXuAEk7Qj8PYbU6SztC8zMACa3gha92vF3TWDx13IiJOa1dxQ#fidkdWxOYHwnPyd1blpxYHZxWjA0V1dSVFw1M0EzQ2hzQlExYXRSNUQ2MXxNMTBIUUxBYDFtc2BPNH19NHB3clVANlVPRzNwcWJJcVxDdWNTZjRQaUxzYDBAYHdWMTBERHxrMm1gajRPN3MyNTVTVEh%2Fd3BdSCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'

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
