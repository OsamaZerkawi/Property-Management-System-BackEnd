
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function CompareTwoPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
    }),

    ApiQuery({
      name: 'id1',
      required: true,
      type: Number,
      description: 'معرف العقار الأول للمقارنة',
      example: 13,
    }),

    ApiQuery({
      name: 'id2',
      required: true,
      type: Number,
      description: 'معرف العقار الثاني للمقارنة',
      example: 14,
    }),

    ApiOkResponse({
      description: 'تمت المقارنة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم المقارنة بين العقارين بنجاح',
          data: {
            property_1: {
              property_details: {
                id: 13,
                area: 83.92,
                property_type: 'عقار سياحي',
                ownership_type: 'بدون أوراق ثبوتية',
                direction: 'شمال غربي',
                status: 'متوفر',
                floor_number: 5,
                has_furniture: true,
                highlighted: false,
                notes: '...',
                listing_type: 'بيع',
                price: 69022091,
              },
              room_details: {
                total: 2,
                bedroom: 0,
                living_room: 1,
                kitchen: 1,
                bathroom: 3,
              },
              location: {
                coordinates: {
                  latitude: '-8.4806000',
                  longitude: '6.3744000',
                },
                city: {
                  id: 1,
                  name: 'دمشق',
                },
                region: {
                  id: 15,
                  name: 'القابون',
                },
                full_address: 'دمشق, القابون',
              },
              images: [
                {
                  id: 29,
                  image_url:
                    'http://localhost:3000/uploads/properties/images/...',
                },
              ],
            },
            property_2: {
              property_details: {
                id: 14,
                area: 59.74,
                property_type: 'عقار سكني',
                ownership_type: 'إفراز رسمي',
                direction: 'جنوب',
                status: 'متوفر',
                floor_number: 0,
                has_furniture: false,
                highlighted: true,
                notes: '...',
                listing_type: 'بيع',
                price: 55217674,
              },
              room_details: {
                total: 3,
                bedroom: 0,
                living_room: 2,
                kitchen: 1,
                bathroom: 1,
              },
              location: {
                coordinates: {
                  latitude: '75.6805000',
                  longitude: '-146.0015000',
                },
                city: {
                  id: 1,
                  name: 'دمشق',
                },
                region: {
                  id: 15,
                  name: 'القابون',
                },
                full_address: 'دمشق, القابون',
              },
              images: [
                {
                  id: 31,
                  image_url:
                    'http://localhost:3000/uploads/properties/images/...',
                },
              ],
            },
          },
          status_code: 200,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'لم يتم العثور على أحد العقارين أو كلاهما',
      schema: {
        example: {
          successful: false,
          message: 'لم يتم العثور على أحد العقارين أو كلاهما',
          status_code: 404,
        },
      },
    }),
  );
}
