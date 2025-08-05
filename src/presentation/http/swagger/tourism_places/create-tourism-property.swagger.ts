import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'; 
import { PropertyFurnishingType } from 'src/domain/enums/property-furnishing-type.enum';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';

export function CreateTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء عقار سياحي',
      description: 'يقوم هذا المسار بإنشاء منشور عقار سياحي مرتبط بالمكتب الحالي.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          post: {
            type: 'object',
            properties: {
              description: { type: 'string', example: 'عقار سياحي رائع على البحر' },
              tag: {
                type: 'string',
                enum: Object.values(PropertyPostTag),
                example: PropertyPostTag.Farm,
              },
              image: { type: 'string', example: 'image-url.jpg' },
            },
            required: ['description', 'tag', 'image'],
          },
          public_information: {
            type: 'object',
            properties: {
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
            },
            required: [
              'region_id',
              'latitude',
              'longitude',
              'area',
              'room_count',
              'living_room_count',
              'kitchen_count',
              'bathroom_count',
              'has_furniture',
            ],
          },
          tourism_place: {
            type: 'object',
            properties: {
              additional_services: {
                type: 'array',
                items: { type: 'string' },
                example: ['مكان للشواء','منطقة ألعاب أطفال'],
              },
              price: { type: 'number', example: 500000 },
              street: { type: 'string', example: 'شارع الكورنيش' },
              electricity: { type: 'string', example: 'متوفر' },
              water: { type: 'string', example: 'متوفر' },
              pool: { type: 'string', example: 'نعم' },
            },
            required: ['additional_services_ids', 'price', 'street', 'electricity', 'water', 'pool'],
          },
        },
        required: ['post', 'public_information', 'tourism_place'],
      },
    }),
    ApiCreatedResponse({
      description: 'تم إنشاء العقار السياحي بنجاح.',
      schema: {
        example: {
          message: 'تم إنشاء المكان بنجاح',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'البيانات غير مكتملة أو تحتوي على أخطاء.',
      schema: {
        example: {
          message: 'tag يجب أن يكون أحد القيم المحددة',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'عدم العثور على المكتب أو المنطقة.',
      schema: {
        example: {
          message: 'المكتب غير موجود',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          message: 'حدث خطأ غير متوقع',
        },
      },
    }),
  );
}
