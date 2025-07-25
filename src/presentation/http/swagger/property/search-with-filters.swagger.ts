import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ResidentialPropertiesSearchFiltersDto } from 'src/application/dtos/property/residential-properties-search-filters.dto';

export function SearchPropertiesWithFiltersSwaggerDoc() {
  return applyDecorators(

    // ApiConsumes('multipart/form-data'),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة (افتراضي = 1)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر لكل صفحة (افتراضي = 10)',
    }),

    ApiBody({
      type: ResidentialPropertiesSearchFiltersDto,
      description: 'فلاتر البحث المتقدمة',
    }),

    ApiOkResponse({
      description: 'تم جلب العقارات بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب العقارات بنجاح.',
          data: [
            {
              propertyId: 13,
              postTitle: 'مزرعة - 83.92 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, القابون',
              postDate: '2025-07-13',
              is_favorite: 0,
              listing_type: 'بيع',
              price: 69022091,
            }
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 1,
            itemsPerPage: 10,
            totalPages: 1,
          }
        },
      },
    })
  );
}
