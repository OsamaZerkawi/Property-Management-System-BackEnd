
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiOkResponse, ApiParam } from "@nestjs/swagger";

export function GetServiceProviderSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع تفاصيل مزود الخدمة',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لإرجاع تفاصيل مزود خدمة محدد باستخدام معرفه (ID)، مع جميع بياناته الأساسية وصور الشعارات ومعلومات التواصل والتقييمات.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرف مزود الخدمة',
      required: true,
    }),
    ApiOkResponse({
      description: 'تم إرجاع تفاصيل مزود الخدمة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع تفاصيل مزود الخدمة بنجاح',
          data: {
            id: 1,
            name: 'مزود خدمة كهرباء دمشق',
            logo: 'http://localhost:3000/uploads/providers/logo/electric-damascus.png',
            details: 'خبرة أكثر من 10 سنوات في مجال الكهرباء.',
            career: 'كهرباء',
            location: 'دمشق، ريف دمشق',
            userPhone: '0944123456',
            openingTime: '08:00',
            closingTime: '18:00',
            active: 1,
            avgRate: 4.5,
            ratingCount: 12
          },
          status_code: 200,
        },
      },
    }),
  );
}
