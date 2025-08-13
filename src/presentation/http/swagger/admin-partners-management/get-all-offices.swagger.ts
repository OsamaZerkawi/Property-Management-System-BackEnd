import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";

export function GetOfficesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع المكاتب',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لإرجاع جميع المكاتب ضمن المدينة المخصصة له، وإذا لم يكن له مدينة، سيتم إرجاع جميع المكاتب.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع المكاتب بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع المكاتب بنجاح',
          data: [
            {
              id: 1,
              logo: 'http://localhost:3000/uploads/offices/logos/logo1.png',
              name: 'مكتب دمشق',
              type: 'عقارات',
              location: 'دمشق، ريف دمشق',
              rate: {
                avgRate: 4.5,
                count: 12,
              },
            },
            {
              id: 2,
              logo: 'http://localhost:3000/uploads/offices/logos/logo2.png',
              name: 'مكتب حلب',
              type: 'عقارات',
              location: 'حلب، حلب',
              rate: {
                avgRate: 4.0,
                count: 8,
              },
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
