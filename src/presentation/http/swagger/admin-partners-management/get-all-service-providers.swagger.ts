
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from "@nestjs/swagger";

export function GetServiceProvidersSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع مزودي الخدمات',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لإرجاع جميع مزودي الخدمات ضمن المدينة المخصصة له، وإذا لم يكن له مدينة، سيتم إرجاع جميع مزودي الخدمات النشطين.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع مزودي الخدمات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع مزودي الخدمات بنجاح',
          data: [
            {
              id: 1,
              name: 'مزود خدمة كهرباء دمشق',
              logo: 'http://localhost:3000/uploads/providers/logo/electric-damascus.png',
              career: 'كهرباء',
              opening_time: '08:00',
              closing_time: '18:00',
              location: 'دمشق، ريف دمشق',
              userPhone: '0944123456',
              avgRate: 4.5,
              ratingCount: 12
            },
            {
              id: 2,
              name: 'مزود خدمة سباكة حلب',
              logo: 'http://localhost:3000/uploads/providers/logo/plumbing-halab.png',
              career: 'سباكة',
              opening_time: '09:00',
              closing_time: '17:00',
              location: 'حلب، حلب',
              userPhone: '0933123456',
              avgRate: 4.0,
              ratingCount: 8
            }
          ],
          status_code: 200
        },
      },
    }),
  );
}
