import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ServiceType } from 'src/domain/enums/service-type.enum';

export function GetPriceSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'جلب سعر خدمة محددة',
      description: 'يرجع سعر الخدمة المطلوبة عبر query string باسم service.',
    }),
    ApiQuery({
      name: 'service',
      required: true,
      enum: ServiceType,
      description: 'نوع الخدمة المطلوب سعرها (إعلان صوري أو ترويجي)',
      example: ServiceType.IMAGE_AD,
    }),
    ApiResponse({
      status: 200,
      description: 'تم إرجاع سعر الخدمة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع سعر الخدمة بنجاح',
          data: {
            price: 150.5,
          },
          status_code: 200,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'طلب غير صالح (مثلاً: لم تُمرر خدمة صحيحة)',
      schema: {
        example: {
          successful: false,
          message: 'حقل service مطلوب أو من نوع غير صحيح',
          data: null,
          status_code: 400,
        },
      },
    }),
  );
}
