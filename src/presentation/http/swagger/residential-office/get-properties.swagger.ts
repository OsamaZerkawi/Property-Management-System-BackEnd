import { ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const GetOfficePropertiesSuccessResponse = ApiOkResponse({
  description: 'تم إرجاع جميع العقارات الخاصة بمكتبك',
  schema: {
    example: {
      successful: true,
      message: 'تم ارجاع جميع العقارات الخاصة بمكتبك',
      data: [
        // ✅ مثال 1: حالة الإيجار (أجار)
        {
          postTitle: "شقة مفروشة للإيجار",
          postDescription: "شقة مفروشة بالكامل في وسط المدينة",
          postImage: "http://localhost:3000/uploads/properties/posts/images/1.jpg",
          postDate: "2025-07-08",
          PostStatus: "متاح",
          propertyId: 12,
          area: 120,
          property_type: "سكني",
          ownership_type: "تمليك",
          direction: "شمال",
          status: "متاح",
          coordinates: {
            latitude: 33.514,
            longitude: 36.276
          },
          floor_number: 2,
          notes: "بجانب المسجد",
          highlighted: true,
          room_counts: {
            total: 5,
            bedroom: 3,
            living_room: 1,
            kitchen: 1,
            bathroom: 2
          },
          has_furniture: true,
          location: "دمشق, ميدان",
          region: {
            id: 3,
            name: "ميدان"
          },
          city: {
            id: 1,
            name: "دمشق"
          },
          images: [
            {
              id: 5,
              image_url: "http://localhost:3000/uploads/properties/images/image1.jpg"
            }
          ],
          tag: "مميز",
          listing_type: "أجار",
          rate: 4.5,
          rent_details: {
            price: 250000,
            rental_period: "شهري"
          }
        },
        // ✅ مثال 2: حالة البيع (بيع)
        {
          postTitle: "شقة للبيع بالتقسيط",
          postDescription: "شقة للبيع في مشروع راقٍ مع إمكانية التقسيط",
          postImage: "http://localhost:3000/uploads/properties/posts/images/2.jpg",
          postDate: "2025-07-06",
          PostStatus: "متاح",
          propertyId: 18,
          area: 150,
          property_type: "سكني",
          ownership_type: "تمليك",
          direction: "شرقي",
          status: "متاح",
          coordinates: {
            latitude: 33.520,
            longitude: 36.300
          },
          floor_number: 3,
          notes: "بجانب الحديقة",
          highlighted: false,
          room_counts: {
            total: 6,
            bedroom: 4,
            living_room: 1,
            kitchen: 1,
            bathroom: 2
          },
          has_furniture: false,
          location: "دمشق, مشروع دمر",
          region: {
            id: 5,
            name: "مشروع دمر"
          },
          city: {
            id: 1,
            name: "دمشق"
          },
          images: [
            {
              id: 7,
              image_url: "http://localhost:3000/uploads/properties/images/image2.jpg"
            }
          ],
          tag: "جديد",
          listing_type: "بيع",
          sell_details: {
            selling_price: 150000000,
            installment_allowed: true,
            installment_duration: 24
          }
        }
      ],
      status_code: 200
    }
  }
});

export const GetOfficePropertiesAuth = ApiBearerAuth();

export const GetOfficePropertiesUnauthorized = ApiUnauthorizedResponse({
  description: 'توكن غير صالح',
  schema: {
    example: {
      successful: false,
      error: 'توكن غير صالح',
      status_code: 401
    }
  }
});



