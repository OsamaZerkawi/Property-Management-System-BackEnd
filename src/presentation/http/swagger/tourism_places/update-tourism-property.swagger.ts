import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function UpdateTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'تحديث بيانات عقار سياحي',
      description: 'يمكنك من تعديل بيانات العقار السياحي وصورته إذا لزم الأمر',
    }),

    ApiConsumes('multipart/form-data'),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          postImage: {
            type: 'string',
            format: 'binary',
            description: 'الصورة الجديدة للعقار (اختياري)',
          },
          post: {
            type: 'object',
            properties: {
              description: { type: 'string', example: 'وصف جديد للعقار' },
              tag: {
                type: 'string',
                example: 'سياحي',
                description: 'الوسم الجديد للإعلان',
              },
            },
          },
          public_information: {
            type: 'object',
            properties: {
              region_id: { type: 'number', example: 5 },
              latitude: { type: 'number', example: 33.5138 },
              longitude: { type: 'number', example: 36.2765 },
              area: { type: 'number', example: 140 },
              room_count: { type: 'number', example: 4 },
              living_room_count: { type: 'number', example: 2 },
              kitchen_count: { type: 'number', example: 1 },
              bathroom_count: { type: 'number', example: 2 },
              has_furniture: {
                type: 'string',
                example: 'غير مفروش',
              },
            },
          },
          tourism_place: {
            type: 'object',
            properties: {
              price: { type: 'number', example: 150000 },
              street: { type: 'string', example: 'شارع بغداد' },
              electricity: { type: 'string', example: 'متوفرة جزئياً' },
              water: { type: 'string', example: 'منتظمة' },
              pool: { type: 'string', example: 'لا يوجد' },
              additional_services: {
                type: 'array',
                items: { type: 'string' },
                example: ['خدمة تنظيف', 'تكييف مركزي'],
              },
            },
          },
        },
      },
    }),

    ApiOkResponse({
      description: 'تم تحديث العقار السياحي بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تحديث العقار السياحي بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'فشل في التحقق من صحة البيانات',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ في إدخال البيانات',
          status_code: 400,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'لم يتم العثور على العقار أو المكتب',
      schema: {
        example: {
          successful: false,
          message: 'العقار السياحي غير موجود للمكتب',
          status_code: 404,
        },
      },
    }),
  );
}
