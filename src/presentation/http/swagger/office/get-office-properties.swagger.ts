import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function GetOfficePropertiesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
      description:
        'إرجاع قائمة العقارات المرتبطة بمكتب معين مع دعم التصفية حسب النوع والتقسيم إلى صفحات. ' 
    }),

    ApiParam({
      name: 'officeId',
      type: Number,
      example: 11,
      description: 'معرف المكتب الذي سيتم عرض عقاراته',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة المطلوبة (افتراضي: 1)',
    }),

    ApiQuery({
      name: 'items',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العقارات في الصفحة (افتراضي: 10)',
    }),

    ApiQuery({
      name: 'property_type',
      required: false,
      type: String,
      enum: ['عقاري', 'سياحي'],
      example: 'عقاري',
      description: 'نوع العقار للتصفية (اختياري).',
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات بنجاح.',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع العقارات بنجاح',
          page: 1,
          items: 10,
          total: 2,
          data: [
            {
              propertyId: 2,
              postTitle: 'أرض 256.01 م²',
              postImage: 'http://192.168.1.9:3000/uploads/properties/posts/images/property.png',
              location: 'ريف دمشق, صحنايا',
              postDate: null,
              is_favorite: 1,         
              type: 'عقاري',
              listing_type: 'أجار',   
              rental_period: 'سنوي',  
              price: 508,
              rate: 2.3
            },
            {
              propertyId: 79,
              postTitle: 'مكتب 146.20 م²',
              postImage: 'http://192.168.1.9:3000/uploads/properties/posts/images/tourisem.png',
              location: 'درعا, نوى',
              postDate: null,
              is_favorite: 0,
              type: 'سياحي',
              price: 1070,
              rental_period: 'يومي',    
              rate: 4.3
            }
          ],
          status_code: 200
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'بيانات غير صالحة.',
      schema: {
        example: {
          successful: false,
          message: 'officeId يجب أن يكون رقماً صحيحاً',
          status_code: 400,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'المكتب غير موجود.',
      schema: {
        example: {
          successful: false,
          message: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
}
