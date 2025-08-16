import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

export function GetPendingPropertyPostsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Admin - Property Posts'),
    ApiOperation({
      summary: 'إرجاع جميع منشورات العقارات المعلقة',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لإرجاع قائمة بجميع منشورات العقارات التي في حالة انتظار الموافقة، مع بياناتها الأساسية.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع المنشورات المعلقة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع منشورات العقارات بنجاح',
          data: [
            {
              id: 1,
              title: 'شقة للإيجار في الرياض',
              image:
                'http://localhost:3000/uploads/properties/posts/images/image1.jpg',
              location: 'الرياض، منطقة العليا',
              office_name: 'Carter - Jacobson',
              office_location: 'ريف دمشق، النبك',
              type: 'عقاري',
              listing_type: 'أجار',
              rental_price: 15000,
              rental_period: 'شهري',
            },
            {
              id: 2,
              title: 'فيلا للبيع في جدة',
              image:
                'http://localhost:3000/uploads/properties/posts/images/image2.jpg',
              location: 'جدة، حي المروة',
              listing_type: 'بيع',
              selling_price: 450000,
            },
            {
              id: 3,
              title: 'منتجع للإيجار',
              image:
                'http://localhost:3000/uploads/properties/posts/images/image3.jpg',
              location: 'الدمام، كورنيش',
              type: 'سياحي',
              listing_type: 'أجار',
              rental_period: 'يومي',
              price: 500,
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
