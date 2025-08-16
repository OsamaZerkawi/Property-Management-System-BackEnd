import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

export function GetOfficeListSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description:
        'API لعرض المكاتب العقارية مع الشعار، النوع، الموقع، ومتوسط التقييم، مع دعم التصفح بالصفحات (Pagination) والفلاتر الاختيارية.',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة المطلوبة (افتراضي = 1)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر في كل صفحة (افتراضي = 10)',
    }),

    ApiQuery({
      name: 'city_id',
      required: false,
      type: Number,
      example: 2,
      description: 'معرف المدينة لفلترة المكاتب حسب المدينة',
    }),

    ApiQuery({
      name: 'region_id',
      required: false,
      type: Number,
      example: 5,
      description: 'معرف المنطقة لفلترة المكاتب حسب المنطقة',
    }),

    ApiQuery({
      name: 'type',
      required: false,
      type: String,
      example: 'عقاري',
      description: 'نوع المكتب (مثال: عقاري، سياحي,الكل)',
    }),

    ApiQuery({
      name: 'rate',
      required: false,
      type: Number,
      example: 4,
      description:
        'تصفية المكاتب التي متوسط تقييمها يساوي أو أكبر من هذا الرقم (1-5)',
    }),

    ApiOkResponse({
      description: 'تم جلب قائمة المكاتب العقارية بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع قائمة المكاتب',
          data: [
            {
              officeId: 4,
              name: 'مكتب الهدى للعقارات',
              logo: 'http://localhost:3000/uploads/offices/logos/logo1.png',
              type: 'سكني',
              location: 'دمشق، ميدان',
              rate: 5,
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 20,
            itemsPerPage: 10,
            totalPages: 2,
          },
        },
      },
    }),
  );
}
