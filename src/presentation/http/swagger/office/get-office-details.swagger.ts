import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetOfficeDetailsSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاص بداش المكتب' }),
    ApiResponse({
      status: 200,
      description: 'تم جلب بيانات المكتب بنجاح',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'تم جلب بيانات المكتب بنجاح' },
          statusCode: { type: 'number', example: 200 },
          data: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 5 },
              name: { type: 'string', example: 'مكتب النجاح' },
              logo: { type: 'string', nullable: true, example: 'http://localhost:3000/uploads/offices/logos/logo.png' },
              type: { type: 'string', example: 'سياحي' },
              commission: { type: 'number', example: 10 },
              booking_period: { type: 'number', example: 30 },
              deposit_per_m2: { type: 'number', example: 50 },
              tourism_deposit: { type: 'number', example: 100 },
              payment_method: { type: 'string', example: 'دفع الكتروني' },
              opening_time: { type: 'string', example: '09:00' },
              closing_time: { type: 'string', example: '18:00' },
              latitude: { type: 'number', example: 33.5157 },
              longitude: { type: 'number', example: 36.2765 },
              region: { type: 'string', nullable: true, example: 'المزة' },
              city: { type: 'string', nullable: true, example: 'دمشق' },
              default_meter_price: { type: 'number', nullable: true, example: 500 },
              socials: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Facebook' },
                    link: { type: 'string', example: 'https://facebook.com/myoffice' },
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'المكتب غير موجود' }),
  );
}
