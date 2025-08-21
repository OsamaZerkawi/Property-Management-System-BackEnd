// src/docs/explore-map.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ExploreMapSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'استكشاف العقارات والمكاتب ضمن حدود الخريطة',
      description:
        'هذه الواجهة تقوم بإرجاع مواقع (إحداثيات) العقارات والمكاتب التي تقع داخل الحدود الجغرافية المحددة بواسطة الإحداثيات المرسلة في الطلب.',
    }),

    ApiQuery({
      name: 'minLat',
      required: true,
      description: 'أقل خط عرض (الحد الجنوبي)',
      type: Number,
      example: 33.12345,
    }),
    ApiQuery({
      name: 'maxLat',
      required: true,
      description: 'أعلى خط عرض (الحد الشمالي)',
      type: Number,
      example: 33.6789,
    }),
    ApiQuery({
      name: 'minLng',
      required: true,
      description: 'أقل خط طول (الحد الغربي)',
      type: Number,
      example: 35.12345,
    }),
    ApiQuery({
      name: 'maxLng',
      required: true,
      description: 'أعلى خط طول (الحد الشرقي)',
      type: Number,
      example: 35.6789,
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات والمكاتب ضمن حدود الخريطة المحددة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع العقارات والمكاتب ضمن حدود الخريطة المحددة بنجاح',
          data: [
            {
              id: 97,
              lat: 34.855793,
              lng: 36.633459,
              type: 'سياحي',
              card: {
                propertyId: 97,
                postTitle: 'مزرعة 62.97 م²',
                postImage:
                  'http://localhost:3000/uploads/properties/posts/images/tourisem.png',
                location: 'حلب - الفرقان',
                postDate: '2025-08-17',
                is_favorite: 0,
                type: 'سياحي',
                price: 3374,
                rental_period: 'يومي',
                rate: 3.5,
                rating_count: 6,
              },
            },
            {
              id: 4,
              lat: 33.616141,
              lng: 38.935765,
              type: 'مكتب',
              card: {
                name: 'عاشور - يافع',
                logo: 'http://localhost:3000/uploads/offices/logos/office.jpeg',
                type: 'عقاري',
                location: 'درعا, الصنمين',
                rate: 2.7,
                rating_count: 3,
              },
            },
            {
              id: 38,
              lat: 34.814108,
              lng: 36.203735,
              type: 'عقاري',
              card: {
                propertyId: 38,
                postTitle: 'شاليه 149.51 م²',
                postImage:
                  'http://localhost:3000/uploads/properties/posts/images/property.png',
                location: 'درعا - الصنمين',
                postDate: '2025-08-17',
                is_favorite: 0,
                type: 'عقاري',
                listing_type: 'بيع',
                price: 596159,
                rate: 0,
                rating_count: 0,
              },
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
