
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateFaqDto } from 'src/application/dtos/support/update-faq.dto';

export function ApiUpdateFaq() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'تعديل سؤال موجود (FAQ)' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرف السؤال المراد تعديله',
      example: 1,
    }),
    ApiBody({
      type: UpdateFaqDto,
      description: 'البيانات المراد تعديلها (سؤال أو جواب)',
      examples: {
        example1: {
          summary: 'تعديل السؤال والجواب',
          value: {
            question: 'كيف يمكنني تحديث كلمة المرور؟',
            answer: 'اذهب إلى الإعدادات -> الأمان -> تغيير كلمة المرور',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'تم تعديل السؤال بنجاح',
      schema: {
        example: {
          status: true,
          message: 'تم تعديل السؤال بنجاح',
          code: 200,
          data: {
            id: 1,
            question: 'كيف يمكنني تحديث كلمة المرور؟',
            answer: 'اذهب إلى الإعدادات -> الأمان -> تغيير كلمة المرور',
            updated_at: '2025-08-16T12:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'السؤال غير موجود' }),
    ApiResponse({ status: 400, description: 'طلب غير صالح' }),
  );
}
