// presentation/http/decorators/report-office-formdata.swagger.ts
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

export function CreateComplaintOfficeSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description: 'يرسل المستخدم بلاغاً عن مكتب.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          office_id: {
            type: 'string',
            example: '11',
            description: 'معرّف المكتب (يُرسل كنص في form-data وسيحوّله DTO إلى رقم).',
          },
          complaint: {
            type: 'string',
            example: 'المكتب لا يرد على العملاء منذ أسبوع',
            description: 'نص البلاغ أو الشكوى.',
          },
        },
        required: ['office_id', 'complaint'],
      },
    }),
    ApiCreatedResponse({
      description: 'تم إرسال البلاغ بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم إرسال البلاغ بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'بيانات غير صالحة.',
      schema: {
        example: {
          successful: false,
          message: 'office_id يجب أن يكون رقماً',
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
      description: 'مستخدم غير مصادق.',
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
    }),
  );
}
