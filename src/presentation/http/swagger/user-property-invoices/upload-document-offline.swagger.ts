import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function UploadInvoiceDocumentOfflineSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'رفع وثيقة الدفع مع بيانات الحجز',
      schema: {
        type: 'object',
        required: ['propertyId', 'phone', 'document'],
        properties: {
          propertyId: { type: 'integer', example: 123, description: 'معرّف العقار' },
          phone: { type: 'string', example: '0934123456', description: 'رقم هاتف المستخدم' },
          document: {
            type: 'string',
            format: 'binary',
            description: 'صورة وثيقة الدفع (مطلوبة)',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'تم رفع وثيقة الدفع بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم رفع وثيقة الدفع بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'بيانات غير صحيحة أو ناقصة',
      schema: {
        example: {
          successful: false,
          error: 'بيانات غير صحيحة',
          status_code: 400,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'توكن غير صالح أو مفقود',
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
    ApiNotFoundResponse({
      description: 'لم يتم رفع صورة الوثيقة أو لا يوجد عقار أو مستخدم بهذا المعرف/الهاتف',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  successful: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'لم يتم رفع صورة الوثيقة' },
                  status_code: { type: 'number', example: 404 },
                },
              },
              {
                type: 'object',
                properties: {
                  successful: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'لا يوجد عقار لهذا المعرف' },
                  status_code: { type: 'number', example: 404 },
                },
              },
              {
                type: 'object',
                properties: {
                  successful: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'لا يوجد مستخدم لهذا الرقم' },
                  status_code: { type: 'number', example: 404 },
                },
              },
            ],
          },
          examples: {
            documentNotUploaded: {
              summary: 'لم يتم رفع صورة الوثيقة',
              value: {
                successful: false,
                error: 'لم يتم رفع صورة الوثيقة',
                status_code: 404,
              },
            },
            propertyNotFound: {
              summary: 'لا يوجد عقار لهذا المعرف',
              value: {
                successful: false,
                error: 'لا يوجد عقار لهذا المعرف',
                status_code: 404,
              },
            },
            userNotFound: {
              summary: 'لا يوجد مستخدم لهذا الرقم',
              value: {
                successful: false,
                error: 'لا يوجد مستخدم لهذا الرقم',
                status_code: 404,
              },
            },
          },
        },
      },
    }),
  );
}
