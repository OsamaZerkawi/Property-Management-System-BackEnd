import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

export function CreateImageAdSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء طلب إعلان صوري',
      description: 'يرسل طلب إعلان صوري بإرفاق ملف الصورة وفترة العرض (day_period).',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['image', 'day_period'],
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'ملف الصورة للإعلان',
          },
          day_period: {
            type: 'number',
            description: 'المدة (عدد الفترات الزمنية) للإعلان',
            example: 3,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'تم ارسال طلب الإعلان بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارسال طلب الإعلان بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'لا يوجد مكتب خاص بالمستخدم',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد مكتب خاص بك',
          data: null,
          status_code: 404,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'خطأ في البيانات المرسلة (مثلاً: ملف ناقص أو day_period غير صالح)',
      schema: {
        example: {
          successful: false,
          message: 'حقل day_period مطلوب أو ملف الإعلان مفقود',
          data: null,
          status_code: 400,
        },
      },
    }),
  );
}
