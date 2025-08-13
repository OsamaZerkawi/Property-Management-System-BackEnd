
import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";

export function GetApprovedAdsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'عرض الإعلانات والممتلكات المروجة المعتمدة',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لعرض جميع الإعلانات (إعلانات الصور والممتلكات المروجة) التي تم اعتمادها، مع تفاصيل مدة النشاط وتاريخ البداية.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع الإعلانات الحالية بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع الإعلانات الحالية',
          data: [
            {
              id: 1,
              image: 'http://localhost:3000/uploads/advertisements/images/ad1.jpg',
              type: 'إعلان صوري',
              amount: 200,
              office_name: 'مكتب الهدى',
              start_date: '2025-08-10',
              active_days: '7 أيام',
            },
            {
              id: 2,
              type: 'إعلان ترويجي',
              title: 'شقة فاخرة للبيع',
              amount: 500,
              office_name: 'مكتب الإعمار',
              start_date: '2025-08-08',
              active_days: '14 أيام',
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
