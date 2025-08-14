
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from "@nestjs/swagger";

export function GetAdRequestsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع طلبات الإعلانات',
      description: 'هذه الواجهة تُستخدم من قبل المشرف لإرجاع جميع طلبات الإعلانات الحالية التي لم يتم الدفع لها بعد.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع طلبات الإعلانات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع طلبات الإعلانات',
          data: [
            {
              id: 1,
              amount: 1500,
              type: 'IMAGE_AD',
              image: 'http://localhost:3000/uploads/advertisements/images/ad1.png',
              office_name: 'مكتب دمشق',
              day_period: '5 أيام',
              created_at: '2025-08-14T10:00:00.000Z'
            },
            {
              id: 2,
              amount: 900,
              type: 'IMAGE_AD',
              image: 'http://localhost:3000/uploads/advertisements/images/ad2.png',
              office_name: 'مكتب حلب',
              day_period: '3 أيام',
              created_at: '2025-08-13T14:30:00.000Z'
            }
          ],
          status_code: 200,
        },
      },
    }),
  );
}
