
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
import { SortDirection } from 'src/domain/enums/sort-direction.enum';

export function GetFilteredPropertiesSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiQuery({
      name: 'regionId',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم المنطقة',
    }),

    ApiQuery({
      name: 'cityId',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم المنطقة',
    }),

    ApiQuery({
      name: 'tag',
      required: false,
      enum: PropertyPostTag,
      description: 'نوع الوسم (للبيع، للإيجار، سياحي،...إلخ)',
    }),

    ApiQuery({
      name: 'listing_type',
      required: false,
      enum: ListingType,
      description: 'نوع الإدراج (بيع أو أجار)',
    }),

    ApiQuery({
      name: 'orderByArea',
      required: false,
      enum: SortDirection,
      example: 'DSEC',
      description: 'ترتيب حسب المساحة',
    }),

    ApiQuery({
      name: 'orderByPrice',
      required: false,
      enum: SortDirection,
      example: 'DSEC',
      description: 'ترتيب حسب السعر',
    }),

    ApiQuery({
      name: 'orderByDate',
      required: false,
      enum: SortDirection,
      example: 'DSEC',
      description: 'ترتيب حسب التاريخ',
    }),

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
      description: 'عدد العناصر في كل صفحة (افتراضي = 10)',
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات المفلترة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع العقارات المفلترة بنجاح',
          data: [
            {
              propertyId: 13,
              postTitle: 'منتجع - 83.92 متر مربع',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, القابون',
              postDate: '2025-07-13',
              is_favorite: 0,
              listing_type: 'بيع',
              price: 69022091,
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 14,
            itemsPerPage: 10,
            totalPages: 2,
          },
        },
      },
    }),
  );
}
