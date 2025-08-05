import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { UnifiedPropertyStatus } from 'src/application/dtos/tourism/filter-tourism.dto';
 
export function FilterTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description: 'تقوم بتصفية العقارات السياحية بناءً على المدينة، المنطقة أو الحالة.',
    }),
    ApiQuery({
      name: 'city',
      required: false,
      type: String,
      example: 'دمشق',
      description: 'اسم المحافظة',
    }),
    ApiQuery({
      name: 'region',
      required: false,
      type: String,
      example: 'المالكي',
      description: 'اسم المنطقة',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: Object.values(UnifiedPropertyStatus),
      example: UnifiedPropertyStatus.AVAILABLE,
      description: 'حالة العقار (سواء من post أو من touristic)',
    }),
    ApiOkResponse({
      description: 'قائمة العقارات بعد الفلترة',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 12 },
            title: { type: 'string', example: 'شاليه فاخر 150م' },
            region: { type: 'string', example: 'الكرنك' },
            area: { type: 'number', example: 150 },
            price: { type: 'number', example: 500000 },
            status: {
              type: 'string',
              example: 'متوفر',
              description: 'إما حالة المنشور أو حالة السياحي حسب التحقق',
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب غير موجود.',
      schema: {
        example: { statusCode: 404, message: 'المكتب غير موجود' },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ في الخادم.',
      schema: {
        example: { statusCode: 500, message: 'حدث خطأ غير متوقع' },
      },
    }),
  );
}
