import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";

export function GetAllUsersSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'جلب جميع حسابات المستخدمين',
      description:
        'هذه الواجهة تُستخدم لجلب قائمة بجميع حسابات المستخدمين المسجلين في النظام مع بياناتهم الأساسية مثل الاسم، البريد الإلكتروني، ورقم الهاتف.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع حسابات المستخدمين بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع حسابات المستخدمين بنجاح',
          data: [
            {
              id: 1,
              full_name: 'أحمد محمد',
              email: 'ahmed@example.com',
              phone: '0501234567',
              joining_date: '2025-08-12'
            },
            {
              id: 2,
              full_name: 'سارة علي',
              email: 'sara@example.com',
              phone: '0509876543',
              joining_date: '2025-08-01'
            }
          ],
          status_code: 200
        },
      },
    }),
  );
}
