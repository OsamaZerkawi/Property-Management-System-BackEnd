import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';

export function RespondToJoinRequestSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'الرد على طلب انضمام مزود خدمة',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف للموافقة أو رفض طلب انضمام مزود الخدمة، وسيتم إرسال إشعار للمستخدم بالبريد الإلكتروني مع بيانات الدخول أو سبب الرفض.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرف طلب الانضمام',
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
      description: 'تم الرد على طلب الانضمام بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم قبول الطلب وإرسال بيانات الدخول بنجاح', // أو 'تم رفض الطلب وإرسال إشعار للمستخدم'
          data: [],
          status_code: 200,
        },
      },
    }),
  );
}
