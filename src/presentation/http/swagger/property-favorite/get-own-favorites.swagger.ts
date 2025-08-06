
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PropertyType } from 'src/domain/enums/property-type.enum';

export function GetFavoritesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
      description: 'يرجع جميع العقارات المفضلة للمستخدم حسب النوع (سكني أو سياحي)',
    }),

    ApiQuery({
      name: 'type',
      enum: PropertyType,
      required: true,
      example: PropertyType.RESIDENTIAL,
      description: 'نوع العقار: سكني أو سياحي',
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
      description: 'تم إرجاع جميع العقارات المفضلة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع العقارات المفضلة لك',
          data: [
            {
              propertyId: 8,
              postTitle: 'شقة للبيع - 100 متر',
              postImage: 'http://localhost:3000/uploads/properties/posts/images/example.jpg',
              location: 'دمشق, المزة',
              price:123132,
              is_favorite: 1,
              listingType: 'بيع',
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
      description: 'نوع العقار غير صالح أو مفقود',
      schema: {
        example: {
          successful: false,
          message: 'يجب تحديد نوع العقار (سكني أو سياحي)',
          status_code: 400,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'غير مصرح - يجب تسجيل الدخول',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    })
  );
}
