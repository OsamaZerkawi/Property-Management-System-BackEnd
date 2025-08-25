import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function UpdateServiceProviderSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'تحديث بيانات مزود الخدمة (form-data)',
      description:
        'تحديث بيانات مزود الخدمة المرتبط بالمستخدم الحالي. استعمل multipart/form-data لرفع شعار (logo) كملف. باقي الحقول تُرسل كـ form fields.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'مطبخ الشامي', description: 'اسم مزود الخدمة' },
          phone: { type: 'string', example: '09991234567', description: 'رقم التواصل' },
          region_id: { type: 'number', example: 3, description: 'معرّف المنطقة' },
          opening_time: { type: 'string', example: '09:00', description: 'وقت الافتتاح بصيغة HH:mm' },
          closing_time: { type: 'string', example: '22:00', description: 'وقت الإغلاق بصيغة HH:mm' },
          details: { type: 'string', example: 'وصف مختصر للخدمة', description: 'تفاصيل مزود الخدمة' },
          status: { type: 'boolean', example: 'true', description: 'هل الخدمة فعالة ام لا' },
          career: {
            type: 'string',
            example: 'كهربائي',
            description:
              'نوع مزود الخدمة (استخدم إحدى قيم enum ServiceProviderType المتاحة في مشروعك).',
          },
          logo: {
            type: 'string',
            format: 'binary',
            description: 'شعار مزود الخدمة (ارفع ملف هنا، سيتم حفظ filename في الحقل logo)',
          },
        },
        required: [],
      },
    }),
    ApiOkResponse({
      description: 'تم تحديث بيانات مزود الخدمة بنجاح',
      schema: {
        example: {
          success: true,
          message: 'تم تحديث بيانات مزود الخدمة بنجاح',
          statusCode: 200,
          data: [],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'خطأ في صحة البيانات الواردة أو القيم غير مقبولة',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'opening_time must be a valid time string in HH:mm format',
            'region_id must be a number',
          ],
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'المستخدم غير مصادق - مطلوب توكن صالح',
      schema: {
        example: { statusCode: 401, message: 'Unauthorized' },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
      schema: {
        example: { statusCode: 500, message: 'حدث خطأ غير متوقع' },
      },
    }),
  );
}
