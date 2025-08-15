import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ShowMobileTourismSwaggerDoc() {
  return applyDecorators(
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
            postTitle: 'شقة فاخرة',
            description: 'شقة للإيجار السياحي مفروشة بالكامل',
            date: '2025-08-06',
            postImage: 'http://localhost:3000/uploads/properties/posts/images/post.jpg',
            images: [
              'http://localhost:3000/uploads/properties/images/image1.jpg',
              'http://localhost:3000/uploads/properties/images/image2.jpg'
            ],
            location: 'دمشق، المزة',
            longitude: 33.5138,
            latitude: 36.2765,
            area: 120,
            roomCount: 3,
            livingRoomCount: 1,
            kitchenCount: 1,
            bathroomCount: 2,
            hasFurniture: true,
            officeId: 5,
            officeName: 'مكتب المستقبل',
            officeLocation: 'دمشق، الصالحية',
            price: 250000,
            electricity: true,
            water: true,
            pool: false,
            additionalServices: ['منطقة ألعاب أطفال', 'جاكوزي']
          }
        }
      }
    }),
    ApiNotFoundResponse({ description: 'العقار غير موجود' }),
    ApiInternalServerErrorResponse({ description: 'خطأ في الخادم' })
  );
}
