import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
 
export function CreateRentalContractSwaggerDoc() {
  return applyDecorators( 
    ApiBearerAuth(), 
    ApiOperation({
      summary: 'إنشاء عقد إيجار جديد مع تحميل صورة الفاتورة',
      description: 'هذا الـendpoint مخصص لإنشاء عقد إيجار، وتوليد فواتير شهرية تلقائياً مع رفع صورة الفاتورة الأولى.',
    }),
 
    ApiConsumes('multipart/form-data'),
 
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          phone: { type: 'string', example: "0969090711", description: 'رقم المستخدم المستأجر' },
          duration: { type: 'integer', example: 10, description: 'مدة العقد بالأشهر' },
          monthlyRent: { type: 'number', example: 2500, description: 'سعر الإيجار الشهري' },
          propertyId: { type: 'integer', example: 7, description: 'معرف العقار' },
          residentialId: { type: 'integer', example: 3, description: 'معرف الوحدة السكنية' },
          document: {
            type: 'string',
            format: 'binary',
            description: 'صورة وثيقة الفاتورة (تنسيق ملف صالح)',
          },
        },
        required: ['phone', 'duration', 'monthlyRent', 'propertyId', 'residentialId', 'document'],
      },
    }),
 
    ApiCreatedResponse({
      description: 'تم إنشاء العقد بنجاح وتم إصدار الفواتير.',
      schema: {
        example: {
          successful: true,
          message: 'تم انشاء العقد بنجاح',
          data: null,
          status_code: 201,
        },
      },
    }),
 
    ApiBadRequestResponse({
      description: 'خطأ في البيانات المدخلة أو الملف مفقود.',
      schema: {
        example: {
          successful: false,
          error: 'يجب ان يكون هناك وثيقة للفاتورة',
          status_code: 400,
        },
      },
    }),
 
     ApiNotFoundResponse({
      description: 'التحقق من وجود المستخدم',
      schema: {
        example: {
          successful: false,
          error: 'لا يوجد مستخدم لهذا الرقم',
          status_code: 404,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب أو الوحدة السكنية غير موجودة.',
      schema: {
        example: {
          successful: false,
          error: 'الوحدة السكنية |المكتب غير موجود',
          status_code: 404,
        },
      },
    }),
 
    ApiInternalServerErrorResponse({
      description: 'خطأ غير متوقع في الخادم.',
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
