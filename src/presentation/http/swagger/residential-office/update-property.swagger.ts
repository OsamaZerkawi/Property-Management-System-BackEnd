import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
import { OwnershipType } from 'src/domain/enums/ownership-type.enum';
import { Direction } from 'src/domain/enums/direction.enum';
import { ListingType } from 'src/domain/enums/listing-type.enum';
import { RentalPeriod } from 'src/domain/enums/rental-period.enum';

export function UpdateResidentialPropertySwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),

    ApiQuery({
      name: 'residentialId',
      type: Number,
      required: true,
      description: 'معرّف العقار المراد تحديثه',
      example: 123,
    }),
    
    ApiBody({
      description: 'بيانات تحديث العقار (جميع الحقول اختيارية)',
      schema: {
        type: 'object',
        properties: {
          postImage: {
            type: 'string',
            format: 'binary',
            description: 'صورة الإعلان (اختياري)',
          },
          postDescription: { type: 'string', example: 'شقة مميزة قرب الجامعة' },
          tag: { type: 'string', enum: Object.values(PropertyPostTag) },
          regionId: { type: 'integer', example: 3 },
          floor_number: { type: 'number', example: 2 },
          latitude: { type: 'number', example: 33.513 },
          longitude: { type: 'number', example: 36.276 },
          area: { type: 'number', example: 120 },
          ownership_type: { type: 'string', enum: Object.values(OwnershipType) },
          direction: { type: 'string', enum: Object.values(Direction) },
          has_furniture: { type: 'boolean', example: true },
          listing_type: { type: 'string', enum: Object.values(ListingType) },
          room_details: {
            type: 'object',
            properties: {
              room_count: { type: 'integer', example: 5 },
              bedroom_count: { type: 'integer', example: 3 },
              living_room_count: { type: 'integer', example: 1 },
              kitchen_count: { type: 'integer', example: 1 },
              bathroom_count: { type: 'integer', example: 2 },
            },
          },
          rent_details: {
            type: 'object',
            nullable: true,
            properties: {
              rental_period: { type: 'string', enum: Object.values(RentalPeriod) },
              rentalPrice: { type: 'number', example: 250000 },
            },
          },
          sell_details: {
            type: 'object',
            nullable: true,
            properties: {
              selling_price: { type: 'number', example: 150000000 },
              installment_allowed: { type: 'boolean', example: true },
              installment_duration: { type: 'integer', example: 24 },
            },
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'تم تحديث تفاصيل العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تحديث تفاصيل العقار بنجاح',
          data: {},
          status_code: 200,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'بيانات غير صالحة أو مشكلة في صورة الإعلان',
      schema: {
        example: {
          successful: false,
          error: 'بيانات غير صالحة أو لم يتم رفع صورة صحيحة',
          status_code: 400,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'توكن غير صالح',
      schema: {
        example: {
          successful: false,
          error: 'توكن غير صالح',
          status_code: 401,
        },
      },
    }),
  );
}
