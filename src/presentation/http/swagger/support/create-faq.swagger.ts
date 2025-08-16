import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFaqDto } from 'src/application/dtos/support/create-faq.dto';

export function ApiCreateFaq() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'إضافة سؤال جديد (FAQ)' }),
    ApiBody({
      type: CreateFaqDto,
      description: 'البيانات المطلوبة لإضافة سؤال جديد',
      examples: {
        example1: {
          summary: 'مثال على سؤال/جواب',
          value: {
            question: 'كيف يمكنني إعادة تعيين كلمة المرور؟',
            answer: 'اذهب إلى الإعدادات -> الأمان -> إعادة تعيين كلمة المرور',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'تمت إضافة السؤال بنجاح',
      schema: {
        example: {
          status: true,
          message: 'تم إضافة السؤال بنجاح',
          code: 201,
          data: [],
        },
      },
    }),
  );
}
