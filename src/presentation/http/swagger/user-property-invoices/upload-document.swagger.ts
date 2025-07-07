import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";

export function UploadUserPropertyInvoiceDocumentSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiParam({
      name: 'invoiceId',
      required: true,
      type: Number,
      description: 'معرّف الفاتورة',
      example: 10,
    }),

    ApiConsumes('multipart/form-data'),

    ApiBody({
      description: 'الصورة الخاصة بالوثيقة المراد رفعها',
      schema: {
        type: 'object',
        properties: {
          document: {
            type: 'string',
            format: 'binary',
            description: 'صورة الوثيقة (إجباري)',
          },
        },
        required: ['document', 'propertyId']
      }
    }),

    ApiOkResponse({
      description: 'تم رفع صورة الوثيقة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم رفع صورة الوثيقة بنجاح',
          data: [],
          status_code: 200,
        }
      }
    }),

    ApiNotFoundResponse({
      description: 'أحد الأخطاء التالية قد يحدث',
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
                  error: { type: 'string', example: 'الفاتورة غير موجودة' },
                  status_code: { type: 'number', example: 404 },
                },
              },
            ],
          },
          examples: {
            documentNotUploaded: {
              summary: 'الوثيقة غير مرفوعة',
              value: {
                successful: false,
                error: 'لم يتم رفع صورة الوثيقة',
                status_code: 404,
              },
            },
            invoiceNotFound: {
              summary: 'الفاتورة غير موجودة',
              value: {
                successful: false,
                error: 'الفاتورة غير موجودة',
                status_code: 404,
              },
            },
          },
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
        }
      }
    }),

    ApiForbiddenResponse({
      description: 'المستخدم لا يمتلك الدور المطلوب أو لم يسجل الدخول',
      schema: {
        example: {
          successful: false,
          error: 'المستخدم لا يمتلك الدور المطلوب',
          status_code: 403,
        }
      }
    })
  );
}
