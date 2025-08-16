import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';


export function ShowMobileTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاص بتطبيق الموبايل' }),
    ApiParam({ name: 'id', required: true, description: 'معرّف العقار' }),
    ApiOkResponse({
      description: 'تم إرجاع تفاصيل العقار السياحي بنجاح',
      schema: {
        example: {
          success: true,
          message: 'تم ارجاع تفاصيل العقار السياحي بنجاح',
          data: {
            propertyId: 1,
            postTitle: 'شاليه على البحر',
            description: 'شاليه سياحي مستقل بمسطح واسع وإطلالة على البحر',
            date: '2025-08-06',
            postImage: 'http://localhost:3000/uploads/properties/posts/images/post.jpg',
            images: [
              'http://localhost:3000/uploads/properties/images/image1.jpg',
              'http://localhost:3000/uploads/properties/images/image2.jpg'
            ],
            location: 'دمشق، المزة',
            longitude: 36.2765,
            latitude: 33.5138,
            area: 120,
            roomCount: 3,
            livingRoomCount: 1,
            kitchenCount: 1,
            bathroomCount: 2,
            hasFurniture: 'مفروش جزئياً',
            // إحصائيات العقار والمستخدم
            avg_rate: 3.00,
            is_favorite: true,
            // معلومات المكتب بوصف منظم
            office: {
              id: 5,
              logo: 'http://localhost:3000/uploads/offices/logos/logo.png',
              type: 'وكالة عقارية',
              name: 'مكتب المستقبل',
              location: 'حلب، العزيزية',
              rate: 4.20,
              rating_count: 25
            },
            price: 250000,
            electricity: 'متوفر 24/7',
            water: 'متوفرة',
            pool: 'مسبح خارجي خاص',
            additionalServices: ['منطقة ألعاب أطفال', 'جاكوزي']
          }
        }
      }
    }),
    ApiNotFoundResponse({ description: 'العقار غير موجود', schema: { example: { statusCode: 404, message: 'العقار غير موجود' } } }),
    ApiInternalServerErrorResponse({ description: 'خطأ في الخادم', schema: { example: { statusCode: 500, message: 'حدث خطأ غير متوقع' } } }),
  );
}