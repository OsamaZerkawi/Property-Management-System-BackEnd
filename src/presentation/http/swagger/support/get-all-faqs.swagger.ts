
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiGetAllFaqs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'عرض جميع الأسئلة الشائعة (FAQs)' }),
    ApiResponse({
      status: 200,
      description: 'تم جلب قائمة الأسئلة بنجاح',
      schema: {
        example: {
          status: true,
          message: 'تم جلب قائمة الأسئلة بنجاح',
          code: 200,
          data: [
            {
              id: 1,
              question: 'كيف يمكنني إعادة تعيين كلمة المرور؟',
              answer: 'اذهب إلى الإعدادات -> الأمان -> إعادة تعيين كلمة المرور',
              created_at: '2025-08-16T12:00:00.000Z',
              updated_at: '2025-08-16T12:00:00.000Z',
            },
            {
              id: 2,
              question: 'كيف أغيّر البريد الإلكتروني؟',
              answer: 'اذهب إلى الإعدادات -> الحساب -> تغيير البريد الإلكتروني',
              created_at: '2025-08-15T10:00:00.000Z',
              updated_at: '2025-08-15T10:00:00.000Z',
            },
          ],
        },
      },
    }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم' }),
  );
}
