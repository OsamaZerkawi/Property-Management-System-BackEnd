import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'; 
import { PropertyFurnishingType } from 'src/domain/enums/property-furnishing-type.enum';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
import { TouristicStatus } from 'src/domain/enums/touristic-status.enum';

export function UpdateTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'تحديث عقار سياحي',
      description: 'يقبل تحديث أي من حقول العقار السياحي بالاعتماد على المعرف.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          // من CreateTourismDto
          description: { type: 'string', example: 'شقة بحرية رائعة' },
          tag: {
            type: 'string',
            enum: Object.values(PropertyPostTag),
            example: PropertyPostTag.Farm,
          },
          image: { type: 'string', format: 'binary', description: 'صورة العقار' },
          region_id: { type: 'number', example: 5 },
          latitude: { type: 'number', example: 33.5138 },
          longitude: { type: 'number', example: 36.2765 },
          area: { type: 'number', example: 120 },
          room_count: { type: 'number', example: 3 },
          living_room_count: { type: 'number', example: 1 },
          kitchen_count: { type: 'number', example: 1 },
          bathroom_count: { type: 'number', example: 2 },
          has_furniture: {
            type: 'string',
            enum: Object.values(PropertyFurnishingType),
            example: PropertyFurnishingType.FullyFurnished,
          },
          additional_services_ids: {
            type: 'array',
            items: { type: 'number' },
            example: [1, 2, 3],
          },
          price: { type: 'number', example: 500000 },
          street: { type: 'string', example: 'شارع الكورنيش' },
          electricity: { type: 'string', example: 'متوفر' },
          water: { type: 'string', example: 'متوفر' },
          pool: { type: 'string', example: 'نعم' },

          // الحقل الجديد في UpdateTourismDto
          status: {
            type: 'string',
            enum: Object.values(TouristicStatus),
            example: TouristicStatus.AVAILABLE,
            description: 'الحالة الجديدة للعقار السياحي',
          },
        },
        // كل الحقول اختيارية في التحديث
        required: [],
      },
    }),
    ApiOkResponse({
      description: 'تم التحديث بنجاح.',
      schema: {
        example: { message: 'تم تحديث العقار السياحي بنجاح' },
      },
    }),
    ApiBadRequestResponse({
      description: 'طلب غير صالح (مثلاً بيانات فارغة).',
      schema: {
        example: { statusCode: 400, message: 'لا توجد بيانات للتحديث' },
      },
    }),
    ApiNotFoundResponse({
      description: 'العقار أو المكتب غير موجود.',
      schema: {
        example: { statusCode: 404, message: 'العقار السياحي غير موجود للمكتب' },
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
