// src/docs/rental-contracts/SearchContractsSwaggerDoc.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function SearchContractsSwaggerDoc() {
  return applyDecorators( 
    ApiBearerAuth(),
 
    ApiOperation({
      summary: 'البحث عن العقود حسب العنوان',
      description:
        'يمكن للمستخدم البحث في عقوده عن طريق كلمة مفتاحية في العنوان، ويُرجع قائمة بالعقود المطابقة.',
    }),
 
    ApiQuery({
      name: 'title',
      type: String,
      required: true,
      description: 'كلمة البحث في عنوان العقد',
      example: 'فيلا',
    }),
 
    ApiOkResponse({
      description: 'تم جلب العقود المطابقة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب العقود بنجاح',
          data: [
            {
              title:  "شاليه 88.54 م²",
              location:"القامشلي، الحسكة",
              startDate: '2025-01-01',
              endDate: '2025-12-31',
              phone: '0934123456',
              status: 'نشط',
              imageUrl:
                'http://localhost:3000/uploads/UserRentalInvoices/invoice1.jpg',
            },
          ],
          status_code: 200,
        },
      },
    }),
 
    ApiBadRequestResponse({
      description: 'كلمة البحث مطلوبة أو فارغة',
      schema: {
        example: {
          successful: false,
          error: 'كلمة البحث مطلوبة.',
          status_code: 400,
        },
      },
    }),
 
    ApiNotFoundResponse({
      description: 'المكتب المرتبط بالمستخدم غير موجود',
      schema: {
        example: {
          successful: false,
          error: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }), 
    ApiInternalServerErrorResponse({
      description: 'حدث خطأ غير متوقع في الخادم',
      schema: {
        example: {
          successful: false,
          error: 'حدث خطأ غير متوقع.',
          status_code: 500,
        },
      },
    }),
  );
}
