import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'; 
import { OfficeType } from 'src/domain/enums/office-type.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';

export function CreateOfficeSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء مكتب جديد',
      description: 'يمكّن المستخدم من إنشاء مكتب واحد فقط مع إمكانية رفع شعار المكتب ووسائل التواصل.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name:             { type: 'string', example: 'مكتب الخليج للعقارات' },
          logo:             { type: 'string', format: 'binary', description: 'شعار المكتب (ملف صورة)' },
          type: {
            type: 'string',
            enum: Object.values(OfficeType),
            example: OfficeType.BOTH,
            description: 'نوع المكتب: سياحي، سكني، أو كلاهما',
          },
          commission:       { type: 'number', example: 5, description: 'نسبة العمولة (%)' },
          booking_period:   { type: 'number', example: 3, description: 'مدة الحجز بالأيام' },
          deposit_per_m2:   { type: 'number', example: 10, description: 'الضمان لكل متر مربع' },
          tourism_deposit:  { type: 'number', example: 500, description: 'الضمان السياحي' },
          payment_method: {
            type: 'string',
            enum: Object.values(PaymentMethod),
            example: PaymentMethod.STRIPE,
            description: 'طريقة الدفع',
          },
          opening_time:     { type: 'string', example: '08:00', description: 'وقت افتتاح المكتب HH:mm' },
          closing_time:     { type: 'string', example: '18:00', description: 'وقت إغلاق المكتب HH:mm' },
          region_id:        { type: 'number', example: 2, description: 'معرّف المنطقة' },
          latitude:         { type: 'number', example: 33.5138, description: 'خط العرض' },
          longitude:        { type: 'number', example: 36.2765, description: 'خط الطول' },
          socials: {
            type: 'array',
            description: 'قائمة وسائل التواصل الاجتماعي',
            items: {
              type: 'object',
              properties: {
                platform: { type: 'string', example: 'Facebook' },
                link:     { type: 'string', example: 'https://facebook.com/office' },
              },
            },
          },
        },
        required: [],
      },
    }),
    ApiCreatedResponse({
      description: 'تم إنشاء المكتب بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إنشاء المكتب بنجاح',
          data: null,
          status_code: 201,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'بيانات غير صالحة أو مفقودة',
      schema: {
        example: {
          successful: false,
          message: 'وقت الافتتاح يجب أن يكون بصيغة HH:mm',
          status_code: 400,
        },
      },
    }),
    ApiConflictResponse({
      description: 'المستخدم لديه مكتب بالفعل',
      schema: {
        example: {
          successful: false,
          message: 'المستخدم يملك مكتب بالفعل. لا يمكن إنشاء أكثر من مكتب واحد',
          status_code: 409,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
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
