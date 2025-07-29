import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function GetUserPropertyReservationsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({summary:'خاصة بالداش مكتب'}),
    ApiOkResponse({
      description: 'تم إرجاع جميع السجلات الخاصة بحجز الأملاك',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع السجلات الخاصة بحجز الأملاك',
          data: [
            {
              id: 1,
              status: 'محجوز',
              buyer_phone: '0934123456',
              region_name: 'مشروع دمر',
              city_name: 'دمشق',
              selling_price: 150000000,
              image_url: 'http://localhost:3000/uploads/properties/images/image1.jpg',
              end_booking: '2025-07-15',
            },
            {
              status: 'متاح',
              buyer_phone: null,
              region_name: 'المزة',
              city_name: 'دمشق',
              selling_price: 200000000,
              image_url: 'http://localhost:3000/uploads/properties/images/image2.jpg',
            },
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
    }),
  );
}
