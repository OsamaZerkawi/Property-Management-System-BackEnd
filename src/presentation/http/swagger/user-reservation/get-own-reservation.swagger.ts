import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiOkResponse, ApiOperation, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PropertyType } from 'src/domain/enums/property-type.enum';

export function GetOwnReservationsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiQuery({
      name: 'type',
      enum: PropertyType,
      required: true,
      example: PropertyType.RESIDENTIAL,
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
      description: 'تم جلب الحجوزات الخاصة بالمستخدم بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب جميل الحجوزات الخاصة بك',
          data: [
            {
              id: 1,
              property_id: 1,
              type: 'عقار سكني',
              image: 'http://localhost:3000/uploads/properties/posts/imageshttps://picsum.photos/seed/8M4G4rF/1401/1682?blur=8',
              start_date: '2025-01-01',
              end_date: '2025-06-01',
              location: 'حمص, الخالدية',
            },
          ],
          status_code: 200,
          pagination: {
            currentPage: 1,
            totalItems: 1,
            itemsPerPage: 10,
            totalPages: 1,
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'خطأ في نوع العقار',
      schema: {
        example: {
          successful: false,
          message: 'يجب تحديد نوع العقار (سكني أو سياحي)',
          status_code: 400,
        },
      },
    }),
  );
}
