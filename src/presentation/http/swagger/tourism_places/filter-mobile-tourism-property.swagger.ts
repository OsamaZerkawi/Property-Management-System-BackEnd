 
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SortDirection } from 'src/domain/enums/sort-direction.enum';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';

export function FilterMobileTourismSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
     summary: 'خاص بتطبيق الموبايل',
      description: 'يرجع قائمة عقارات سياحية مبنية على فلاتر مُحددة مع معلومات الترقيم (pagination).',
    }), 
    ApiQuery({ name: 'regionId',      required: false, type: Number, description: 'معرّف المنطقة' }),
    ApiQuery({ name: 'cityId',        required: false, type: Number, description: 'معرّف المدينة' }),
    ApiQuery({ name: 'tag',           required: false, enum: PropertyPostTag, enumName: 'PropertyPostTag', description: 'كلمة البحث على التاج' }),
     ApiQuery({ name: 'orderByArea',   required: false, enum: SortDirection, enumName: 'SortDirection', description: 'ترتيب حسب المساحة (ASC أو DESC)' }),
    ApiQuery({ name: 'orderByPrice',  required: false, enum: SortDirection, enumName: 'SortDirection', description: 'ترتيب حسب السعر (ASC أو DESC)' }),
    ApiQuery({ name: 'orderByDate',   required: false, enum: SortDirection, enumName: 'SortDirection', description: 'ترتيب حسب التاريخ (ASC أو DESC)' }),
     ApiQuery({ name: 'page',          required: false, type: Number, description: 'الصفحة الحالية',     example: 1 }),
    ApiQuery({ name: 'items',         required: false, type: Number, description: 'عدد العناصر بالصفحة', example: 10 }),

    ApiOkResponse({
      description: 'تمت عملية التصفية بنجاح مع الترقيم',
      schema: {
        type: 'object',
        properties: {
          successful:    { type: 'boolean', example: true },
          message:       { type: 'string',  example: 'تم ارجاع العقارات السياحية بنجاح' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                propertyId: { type: 'number', example: 1 },
                location:   { type: 'string', example: 'دمشق, المزة' },
                postImage:  { type: 'string', example: 'https://...' },
                title:      { type: 'string', example: 'شاليه 55م' },
                price:      { type: 'number', example: 300000 },
              },
            },
          },
          status_code: { type: 'number', example: 200 },
          pagination: {
            type: 'object',
            properties: {
              currentPage:  { type: 'number', example: 1 },
              totalItems:   { type: 'number', example: 9 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages:   { type: 'number', example: 1 },
            },
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'طلب خاطئ (Bad Request)',
      schema: {
        example: { statusCode: 400, message: 'قيمة أحد المعاملات غير صحيحة' },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: { statusCode: 500, message: 'حدث خطأ غير متوقع' },
      },
    }),
  );
}
