
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function GetServiceProviderDetailsSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiParam({
      name: 'id',
      required: true,
      type: Number,
      description: 'معرّف مزود الخدمة',
      example: 1,
    }),

    ApiOkResponse({
      description: 'تم إرجاع تفاصيل مزود الخدمة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع تفاصيل مزود الخدمة',
          data: {
            id: 1,
            name: 'أب محمود',
            logo: 'http://localhost:3000/uploads/providers/logoصورة ',
            details: 'بصمم كلشي بتحتاجو',
            career: 'مصمم ديكور',
            location: 'دمشق, جوبر',
            userPhone: '0935917557',
            openingTime: '9:00 صباحا',
            closingTime: '5:00 مساءا',
            active:1,
            avgRate: 4,
            ratingCount: 1,
            socials: [
              {
                link: "h.fackbook.com",
                platform: "Facebook"
              },
              {
                link: "tt.telegram.com",
                platform: "Telegram"
              },
              {
                link: "whatsapp.com",
                platform: "WhatsApp"
              }
            ]
          },
          status_code: 200,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'لا يوجد مزود خدمات لهذا المعرف',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              successful: { type: 'boolean', example: false },
              message: { type: 'string', example: 'لا يوجد مزود خدمات لهذا المعرف' },
              data: { type: 'array', example: [] },
              status_code: { type: 'number', example: 404 },
            },
          },
          examples: {
            providerNotFound: {
              summary: 'مزود الخدمة غير موجود',
              value: {
                successful: false,
                message: 'لا يوجد مزود خدمات لهذا المعرف',
                data: [],
                status_code: 404,
              },
            },
          },
        },
      },
    }),
  );
}
