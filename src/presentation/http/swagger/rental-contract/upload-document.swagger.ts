import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function UploadInvoiceDocumentSwaggerDoc() {
  return applyDecorators( 
    ApiBearerAuth(),
 
    ApiOperation({
      summary: 'رفع وثيقة فاتورة لعقد إيجار',
      description: 'يُستخدم هذا الـ API لرفع وثيقة فاتورة لعقد إيجار موجود.',
    }),
 
    ApiParam({
      name: 'id',
      type: Number,
      required: true,
      description: 'معرف الفاتورة',
      example: 13,
    }),
 
    ApiConsumes('multipart/form-data'),
 
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          document: {
            type: 'string',
            format: 'binary',
            description: 'صورة الفاتورة (ملف بصيغة صالحة)',
          },
        },
        required: ['document'],
      },
    }),
 
    ApiOkResponse({
      description: 'تم رفع الوثيقة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم رفع الوثيقة بنجاح',
          data: null,
          status_code: 200,
        },
      },
    }),
 
    ApiBadRequestResponse({
      description: 'الملف مفقود أو مرفوع مسبقاً',
      schema: {
        example: {
          successful: false,
          error: 'يوجد وثيقة لهذا السجل بالفعل',
          status_code: 400,
        },
      },
    }),
 
    ApiNotFoundResponse({
      description: 'الفاتورة غير موجودة',
      schema: {
        example: {
          successful: false,
          error: 'الفاتورة غير موجودة',
          status_code: 404,
        },
      },
    }),
 
    ApiUnauthorizedResponse({
      description: 'توكن غير صالح أو منتهي',
      schema: {
        example: {
          successful: false,
          error: 'توكن غير صالح',
          status_code: 401,
        },
      },
    }),
  
    ApiInternalServerErrorResponse({
      description: 'حدث خطأ غير متوقع',
      schema: {
        example: {
          successful: false,
          error: 'حدث خطأ غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
}
