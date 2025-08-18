import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function GetAdminOfficePropertiesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع عقارات مكتب محدد (بدون تقسيم صفحات)',
      description:
        'واجهة لإرجاع جميع العقارات المرتبطة بمكتب محدد للمشرف/المدير، بدون استخدام التصفح بالصفحات.',
    }),

    ApiParam({
      name: 'officeId',
      type: Number,
      example: 11,
      description: 'معرف المكتب الذي سيتم عرض عقاراته',
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع العقارات بنجاح',
          data: [
            {
              propertyId: 2,
              postTitle: 'أرض 256.01 م²',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/property.png',
              location: 'ريف دمشق, صحنايا',
              postDate: '2024-06-12',
              is_favorite: 0,
              type: 'عقاري',
              listing_type: 'بيع',
              rental_period: null,
              price: 508,
              rate: 2.3,
            },
          ],
          status_code: 200,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'المكتب غير موجود.',
      schema: {
        example: {
          successful: false,
          message: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
} 