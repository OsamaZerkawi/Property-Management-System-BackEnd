import { applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function CreateTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إنشاء إعلان عقار سياحي',
      description: 'يقوم هذا المسار بإنشاء عقار سياحي جديد مع بيانات المنشور والموقع والخدمات المرفقة',
    }),

    ApiConsumes('multipart/form-data'),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          postImage: {
            type: 'string',
            format: 'binary',
            description: 'صورة العقار (إلزامية)',
          },
          post: {
            type: 'object',
            properties: {
              description: { type: 'string', example: 'وصف العقار السياحي' },
              tag: {
                type: 'string',
                example: 'سياحي',
                description: 'الوسم (tag) الخاص بالإعلان',
              },
            },
            required: ['description', 'tag'],
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
                example: 'مفروش جزئياً',
                description: 'نوع التأثيث (مفروش كلياً / جزئياً / غير مفروش)',
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
              price: { type: 'number', example: 100000 },
              street: { type: 'string', example: 'شارع الثورة' },
              electricity: { type: 'string', example: 'متوفر 24/7' },
              water: { type: 'string', example: 'متوفرة بشكل دائم' },
              pool: { type: 'string', example: 'مسبح داخلي خاص' },
              additional_services: {
                type: 'array',
                items: { type: 'string' },
                example: ['مكيف', 'شاشة تلفاز', 'خدمة تنظيف يومية'],
              },
            },
            required: [
              'price',
              'street',
              'electricity',
              'water',
              'pool',
              'additional_services',
            ],
          },
        },
        required: ['postImage', 'post', 'public_information', 'tourism_place'],
      },
    }),

    ApiCreatedResponse({
      description: 'تم إنشاء العقار السياحي بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم اضافة المكان بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'فشل في التحقق من صحة البيانات المرسلة',
      schema: {
        example: {
          successful: false,
          message: 'يجب رفع صورة للإعلان',
          status_code: 400,
        },
      },
    }),
  );
}
