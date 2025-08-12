import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiBody, ApiCreatedResponse } from "@nestjs/swagger";

export function CreateAdminSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء حساب مشرف جديد',
      description:
        'هذه الواجهة تُستخدم من قبل المدير لإنشاء حساب مشرف جديد مع تحديد صلاحياته، وسيتم إرسال بيانات الدخول (اسم المستخدم وكلمة المرور) إلى بريده الإلكتروني.',
    }),
    ApiBody({
      schema: {
        example: {
          first_name: 'أحمد',
          last_name: 'محمد',
          email: 'ahmed@example.com',
          permissionIds: [1, 2, 3],
        },
      },
    }),
    ApiCreatedResponse({
      description: 'تم إنشاء حساب المشرف بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم انشاء حساب للمشرف بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),
  );
}
