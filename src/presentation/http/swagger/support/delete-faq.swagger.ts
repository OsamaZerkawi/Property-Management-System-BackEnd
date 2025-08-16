import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiDeleteFaq() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'حذف سؤال موجود (FAQ)' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرف السؤال المراد حذفه',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'تم حذف السؤال بنجاح',
      schema: {
        example: {
          status: true,
          message: 'تم حذف السؤال بنجاح',
          code: 200,
          data: [],
        },
      },
    }),
    ApiResponse({ status: 404, description: 'السؤال غير موجود' }),
    ApiResponse({ status: 400, description: 'طلب غير صالح' }),
  );
}
