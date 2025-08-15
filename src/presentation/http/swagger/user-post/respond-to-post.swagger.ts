
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function RespondToUserPostSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'الرد على طلب منشور مستخدم',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف للرد على طلب منشور مستخدم بالموافقة أو الرفض. في حال الرفض يمكن إرسال سبب الرفض.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      required: true,
      description: 'معرّف المنشور المطلوب الرد عليه',
      example: 5,
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          approved: {
            type: 'boolean',
            example: true,
            description: 'تحديد ما إذا كان المنشور مقبول أو مرفوض',
          },
          reason: {
            type: 'string',
            example: 'المحتوى غير مناسب',
            description: 'السبب في حال تم رفض المنشور (اختياري)',
          },
        },
        required: ['approved'],
      },
    }),
    ApiOkResponse({
      description: 'تم الرد على طلب المنشور بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم الرد على طلب المنشور بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),
  );
}
