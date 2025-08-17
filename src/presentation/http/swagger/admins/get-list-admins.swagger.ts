import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

export function GetSupervisorsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع المشرفين',
      description:
        'هذه الواجهة تُستخدم من قبل المدير لإرجاع قائمة بجميع المشرفين مع بياناتهم وصلاحياتهم.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع المشرفين بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع المشرفين',
          data: [
            {
              id: 1,
              fullName: 'أحمد محمد',
              username: 'ahmed123',
              email: 'dysm.alkafy10@yahoo.com',
              city_id: 3,
              first_name: 'عزيز',
              last_name: 'الدنوني',
              permissions: ['إضافة إعلان', 'حذف إعلان'],
              joiningDate: '2024-05-10T08:30:00.000Z',
            },
            {
              id: 2,
              fullName: 'خالد علي',
              username: 'khaled99',
              permissions: ['تعديل إعلان'],
              joiningDate: '2024-06-12T10:15:00.000Z',
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
