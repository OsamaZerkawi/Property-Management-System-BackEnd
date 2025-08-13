import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiOkResponse } from "@nestjs/swagger";

export function UpdateAdminSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'تحديث بيانات مشرف',
      description:
        'هذه الواجهة تُستخدم من قبل المدير لتحديث بيانات مشرف معين عبر رقم الـ ID الخاص به. يمكن تحديث الاسم، البريد الإلكتروني، أو صلاحيات المشرف، وسيتم إرسال إشعار إلى بريده الإلكتروني.',
    }),
    ApiParam({
      name: 'id',
      description: 'معرف المشرف الذي سيتم تحديث بياناته',
      example: 5,
      required: true,
      type: Number,
    }),
    ApiBody({
      schema: {
        example: {
          first_name: 'محمد',
          last_name: 'أحمد',
          cityId:2,
          email: 'mohammed.ahmed@example.com',
          permissionIds: [1, 2, 4],
        },
      },
    }),
    ApiOkResponse({
      description: 'تم تحديث بيانات المشرف بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تحديث بيانات المشرف بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),
  );
}
