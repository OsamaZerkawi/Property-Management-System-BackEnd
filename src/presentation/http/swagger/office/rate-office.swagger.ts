// presentation/http/decorators/rate-office-formdata.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function RateOfficeSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل', 
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          office_id: {
            type: 'string',
            example: '12',
            description:
              'معرّف المكتب. يُرسل كحقل نصي في form-data (سيحوّله DTO إلى رقم باستخدام @Type(() => Number)).',
          },
          rate: {
            type: 'string',
            format: 'float',
            example: '4.5',
            description:
              'قيمة التقييم (عدد عشري بين 0 و 5). أرسلها كنص في form-data وسيتم تحويلها إلى رقم في الـ DTO.',
          },
        },
        required: ['office_id', 'rate'],
      },
    }),
    ApiCreatedResponse({
      description: 'تم تسجيل التقييم بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم تقييم المكتب بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'قيمة التقييم غير صالحة أو بيانات الطلب غير مكتملة.',
      schema: {
        example: {
          successful: false,
          message: 'قيمة التقييم يجب أن تكون رقمًا بين 0 و 5',
          status_code: 400,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب المطلوب غير موجود.',
      schema: {
        example: {
          successful: false,
          message: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'المستخدم غير مصدق (توكن JWT مفقود أو غير صالح).',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
}
