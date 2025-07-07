import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

export function GetPropertyReservationWithDetailsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiParam({
      name: 'propertyReservationId',
      required: true,
      type: Number,
      description: 'معرّف سجل الحجز',
      example: 7,
    }),

    ApiOkResponse({
      description: 'تم ارجاع سجل حجز الاملاك مع السجلات المالية الخاصة به',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع سجل حجز الاملاك مع السجلات المالية الخاصة به',
          data: {
            status: 'محجوز',
            buyer_phone: '0934123456',
            region_name: 'مشروع دمر',
            city_name: 'دمشق',
            selling_price: 150000000,
            image_url: 'http://localhost:3000/uploads/properties/images/image1.jpg',
            end_booking: '2025-07-15',
            financial_records: [
              {
                id: 1,
                amount: 2000000,
                reason: 'دفعة أولى',
                status: 'غير مدفوعة',
                paymentMethod: 'تحويل بنكي',
                invoiceImage: 'http://localhost:3000/uploads/properties/users/invoices/images/invoice1.jpg',
                created_at: '2025-07-08',
              },
              {
                id: 2,
                amount: 3000000,
                reason: 'دفعة ثانية',
                status: 'مدفوعة',
                paymentMethod: 'كاش',
                invoiceImage: null,
                created_at: '2025-07-15',
              }
            ]
          },
          status_code: 200,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'توكن غير صالح',
      schema: {
        example: {
          successful: false,
          error: 'توكن غير صالح',
          status_code: 401,
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'المستخدم لا يمتلك الدور المطلوب أو لم يسجل الدخول',
      schema: {
        example: {
          successful: false,
          error: 'المستخدم لا يمتلك الدور المطلوب',
          status_code: 403,
        },
      },
    })
  );
}

