
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

export function GetPropertyReservationDetailsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiParam({
      name: 'propertyId',
      required: true,
      type: Number,
      description: 'معرّف العقار المطلوب',
      example: 21,
    }),

    ApiOkResponse({
      description: 'تم ارجاع معلومات أجار العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع معلومات أجار العقار بنجاح',
          data: {
            residential_selling_price: 150000,
            office_commission_amount: 3000,
            total_deposit: 45070.2,
            final_price: 153000
          },
          status_code: 200,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'لم يتم العثور على العقار أو أنه غير معروض للبيع',
      schema: {
        example: {
          successful: false,
          error: 'لم يتم العثور على العقار بالمعرّف 21 أو أنه غير معروض للبيع.',
          status_code: 404,
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
      description: 'المستخدم لا يمتلك الدور المطلوب',
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
