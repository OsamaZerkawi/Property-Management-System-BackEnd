import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PropertyType } from 'src/domain/enums/property-type.enum';

export function GetTopRatedPropertiesForOfficeSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع العقارات الأعلى تقييماً لمكتب (خاصة بصاحب المكتب)',
    }),

    ApiQuery({
      name: 'type',
      required: true,
      enum: PropertyType,
      description: 'نوع العقار (سكني أو سياحي)',
      example: PropertyType.RESIDENTIAL,
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات المميزة للمكتب بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع العقارات المميزة للمكتب',
          data: [
            {
              propertyId: 23,
              postTitle: 'شقة للإيجار الفاخر',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/postImage-1750149670293-808554663.bmp',
              location: 'دمشق - ميدان',
              postDate: '2025-08-24',
              type: 'RESIDENTIAL',
              listing_type: 'أجار',
              price: 15000,
              rental_period: 'سنوي',
              rate: 3.5,
              rating_count: 2,
            },
            {
              propertyId: 45,
              postTitle: 'شاليه على البحر',
              postImage:
                'http://localhost:3000/uploads/properties/posts/images/postImage-1750159670293-808554664.jpg',
              location: 'طرطوس - الكورنيش',
              postDate: '2025-08-20',
              type: 'TOURISTIC',
              price: 200000,
              rental_period: 'يومي',
              rate: 4.8,
              rating_count: 15,
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
