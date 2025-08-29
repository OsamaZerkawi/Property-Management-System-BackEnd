
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

export function GetPropertyDetailsSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),
    
    ApiParam({
      name: 'propertyId',
      required: true,
      type: Number,
      description: 'معرف العقار',
      example: 32,
    }),

    ApiOkResponse({
      description: 'خاصة بتطبيق الجوال',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع تفاصيل العقار',
          data: {
            postTitle: 'مستودع - 289.31 متر مربع',
            postDescription: 'المحسن بعيد نَسِيج فجأة. يتدحرج المرسول مختفي يحفظ أطير.',
            postImage: 'http://localhost:3000/uploads/properties/posts/images/...',
            postDate: '2025-07-13',
            PostStatus: 'مقبول',
            propertyId: 32,
            area: 289.31,
            property_type: 'عقار سياحي',
            ownership_type: 'طابو غير منظم',
            direction: 'جنوب شرقي',
            status: 'غير متوفر',
            coordinates: {
              latitude: '52.4451000',
              longitude: '-51.4150000',
            },
            floor_number: 7,
            notes: 'مدح تنبيه ارباح أقول.',
            highlighted: true,
            room_counts: {
              total: 1,
              bedroom: 0,
              living_room: 2,
              kitchen: 1,
              bathroom: 3,
            },
            has_furniture: true,
            location: 'دمشق, الميدان',
            region: {
              id: 12,
              name: 'الميدان',
            },
            city: {
              id: 1,
              name: 'دمشق',
            },
            images: [
              { id: 68, image_url: 'http://localhost:3000/uploads/properties/images/...' },
              { id: 69, image_url: 'http://localhost:3000/uploads/properties/images/...' }
            ],
            tag: 'مستودع',
            listing_type: 'بيع',
            sell_details: {
              selling_price: 30276607,
              installment_allowed: false,
              installment_duration: 3,
            },
            is_favorite: 0,
            office: {
              id: 4,
              name: 'بن حسين and Sons',
              stripe_payment:true,
              logo: 'http://localhost:3000/uploads/offices/logos/...',
              type: 'كلاهما',
              rate: {
                avreg: 0,
                count: 0,
              }
            }
          },
          status_code: 200
        }
      }
    }),

    ApiNotFoundResponse({
      description: 'العقار غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد عقار بهذا المعرف',
          status_code: 404,
        },
      },
    }),
  );
}
