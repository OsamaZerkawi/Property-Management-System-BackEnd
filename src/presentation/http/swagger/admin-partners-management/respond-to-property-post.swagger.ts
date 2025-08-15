
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';

export function RespondToPropertyPostSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'الرد على منشور العقار',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرف منشور العقار',
      required: true,
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['approved'], // only approved is required
        properties: {
          approved: { type: 'boolean', description: 'تحديد الموافقة أو الرفض' },
          reason: { type: 'string', description: 'سبب الرفض (اختياري)' },
        },
        example: {
          approved: true, // أو false إذا كان الرفض
          reason: 'سبب الرفض إذا تم رفض الطلب', // هذا الحقل اختياري عند الموافقة
        },
      },
    }),
    ApiOkResponse({
      description: 'تم الرد على منشور العقار',
      schema: {
        example: {
          successful: true,
          message: 'تم الرد على منشور العقار', // أو 'تم رفض الطلب وإرسال إشعار للمستخدم'
          data: [],
          status_code: 200,
        },
      },
    }),
  );
}
