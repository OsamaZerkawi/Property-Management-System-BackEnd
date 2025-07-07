
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PurchaseStatus } from 'src/domain/enums/property-purchases.enum';
export function GetUserPropertyReservationsWithFiltersSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),

    // ✅ توثيق الفلاتر
    ApiQuery({
      name: 'regionId',
      required: false,
      type: Number,
      description: 'معرف المنطقة',
      example: 3,
    }),
    ApiQuery({
      name: 'cityId',
      required: false,
      type: Number,
      description: 'معرف المدينة',
      example: 1,
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: PurchaseStatus,
      description: 'حالة الحجز (محجوز - متاح)',
      example: 'محجوز',
    }),

    ApiOkResponse({
      description: 'تم إرجاع جميع السجلات الخاصة بحجز الأملاك مفلترة',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع السجلات الخاصة بحجز الأملاك مفلترة',
          data: [
            {
              status: 'محجوز',
              buyer_phone: '0934123456',
              region_name: 'مشروع دمر',
              city_name: 'دمشق',
              selling_price: 150000000,
              image_url: 'http://localhost:3000/uploads/properties/images/image1.jpg',
              end_booking: '2025-07-15',
            }
          ],
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
