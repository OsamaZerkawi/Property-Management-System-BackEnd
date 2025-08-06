import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ShowTourismSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description: 'يعيد جميع حقول العقار السياحي المنسقة للواجهة بالمعرّف.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'معرّف العقار السياحي',
      example: 106,
    }),
    ApiOkResponse({
      description: 'تم جلب تفاصيل العقار بنجاح.',
      schema: {
        type: 'object',
        properties: {
          propertyId:       { type: 'number', example: 106 },
          title:            { type: 'string', example: 'فيلا 350 متر مربع' },
          description:      { type: 'string', example: 'وصف مختصر للمنشور هنا' },
          date:             { type: 'string', example: '2025-08-05' },
          tag:              { type: 'string', example: 'فيلا' },
          postImage:        { type: 'string', example: 'http://localhost:3000/uploads/properties/posts/images/url.jpg' },
          postStatus:           { type: 'string', example: 'مرفوض' },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 138,
                },
                image_url: {
                  type: 'string',
                  example: 'http://localhost:3000/uploads/properties/images/property.jpeg',
                },
              },
            },
          },
          status:           { type: 'string', example: 'غير متوفر' },
          region: { type: 'string', example: 'المزة' },
          city: { type: 'string', example: 'دمشق' },
          street:{type:'string', example: 'شارع بغداد'},
          area:             { type: 'number', example: 350 },
          roomCount:        { type: 'number', example: 4 },
          livingRoomCount:  { type: 'number', example: 2 },
          kitchenCount:     { type: 'number', example: 1 },
          bathroomCount:    { type: 'number', example: 2 },
          bedroomCount:     { type: 'number', example: 1 },
          hasFurniture:     { type: 'string', example: 'فرش فاخر' },
          pricePerNight:    { type: 'string', example: '1000.00', description: 'سعر الليلة' },
          electricity:      { type: 'string', example: 'كهرباء 24/7 مع عدّاد ذكي' },
          water:            { type: 'string', example: 'ماء معبّأ ومفلتر' },
          pool:             { type: 'string', example: 'مسبح خارجي بمياه دافئة' },
          additionalServices: {
            type: 'array',
            items: { type: 'string', example: 'مكان للشواء' },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'العقار غير موجود أو لا ينتمي إلى مكتبك.',
      schema: {
        example: { statusCode: 404, message: 'العقار غير موجود أو لا ينتمي إلى مكتبك' },
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
