
import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from "@nestjs/swagger";

export function RespondToAdRequestSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'الرد على طلب إعلان',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف للرد على طلب إعلان معين عن طريق معرفه (ID). يمكن للمشرف الموافقة أو الرفض مع توضيح السبب في حالة الرفض، وسيتم إرسال إشعار إلى صاحب المكتب.',
    }),
    ApiParam({
      name: 'id',
      description: 'معرف الإعلان المطلوب الرد عليه',
      example: 12,
      required: true,
      type: Number,
    }),
    ApiBody({
      schema: {
        example: {
          approved: true, // أو false إذا كان رفض
          reason: 'الإعلان لا يطابق الشروط', // مطلوب فقط عند الرفض
        },
      },
    }),
    ApiOkResponse({
      description: 'تم الرد على طلب الإعلان بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم الرد على طلب الإعلان',
          data: [],
          status_code: 200,
        },
      },
    }),
  );
}
