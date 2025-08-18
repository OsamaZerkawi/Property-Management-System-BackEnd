
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

export function GetAdminOfficePropertiesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Admin - Offices'),
    ApiOperation({
      summary: 'إرجاع جميع عقارات المكتب',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف أو المدير لإرجاع جميع العقارات (سكنية + سياحية) التابعة لمكتب معين، مع تفاصيلها الأساسية.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع العقارات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع العقارات بنجاح',
          data: [
            {
              propertyId: 1,
              residentialId: 10,
              postTitle: 'شقة للإيجار في الرياض',
              postDescription: 'شقة مفروشة بالكامل في حي العليا',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/image1.jpg',
              postDate: '2025-08-17',
              postStatus: 'مقبول',
              area: 120,
              property_type: 'عقاري',
              coordinates: { latitude: 24.7136, longitude: 46.6753 },
              floor_number: 2,
              notes: null,
              highlighted: false,
              has_furniture: true,
              location: 'الرياض، العليا',
              region: { id: 5, name: 'العليا' },
              city: { id: 1, name: 'الرياض' },
              images: [
                {
                  id: 101,
                  image_url:
                    'http://localhost:3000/uploads/properties/images/img1.jpg',
                },
              ],
              tag: 'فاخر',
              ownership_type: 'تمليك',
              direction: 'شرقي',
              status: 'متاح',
              room_counts: {
                total: 4,
                bedroom: 2,
                living_room: 1,
                kitchen: 1,
                bathroom: 2,
              },
              listing_type: 'أجار',
              rent_details: {
                price: 15000,
                rental_period: 'شهري',
              },
              rate: 4.5,
            },
            {
              propertyId: 2,
              postTitle: 'منتجع سياحي في جدة',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/image2.jpg',
              property_type: 'سياحي',
              location: 'جدة، الكورنيش',
              area: 300,
              price: 500,
              status: 'متاح',
              touristic_info: {
                street: 'الكورنيش',
                electricity: true,
                water: true,
                pool: true,
              },
              services: ['خدمة تنظيف', 'مواقف سيارات'],
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
