import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from "@nestjs/swagger";

export function GetAllAdvertisementInvoicesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'عرض جميع فواتير الإعلانات',
      description: 'تُعيد هذه الواجهة قائمة بجميع فواتير الإعلانات سواء كانت إعلانات مباشرة أو عقارات مروجة، مع تفاصيل المكتب وتاريخ الدفع.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع فواتير الإعلانات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع فواتير الإعلانات بنجاح',
          data: [
            {
              id: 12,
              amount: 150.75,
              type: 'إعلان صوري', // أو PROMOTIONAL
              paid_date: '2025-08-10',
              office_id: 3,
              office_name: 'مكتب النور العقاري',
              image: 'http://localhost:3000/uploads/advertisements/images/ad1.jpg',
            },
            {
              id: 13,
              amount: 300.00,
              type: 'إعلان ترويجي',
              paid_date: '2025-08-08',
              office_id: 4,
              office_name: 'مكتب الهدى',
              title: 'مزرعة 200 متر مربع',
            }
          ],
          status_code: 200
        }
      }
    })
  );
}
