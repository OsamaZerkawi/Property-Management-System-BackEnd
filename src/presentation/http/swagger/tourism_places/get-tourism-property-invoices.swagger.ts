import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ShowTourismFinanceByYearSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description: 'يرجع قائمة بالشهور من 1 حتى الشهر الحالي لكل شهر قائمة بفواتير الحجوزات ',
    }),
    ApiParam({ name: 'id',   description: 'معرّف العقار', required: true, schema: { type: 'number', example: 3 } }),
    ApiParam({ name: 'year', description: 'السنة (YYYY)',          required: true, schema: { type: 'number', example: 2025 } }),
    ApiOkResponse({
      description: 'تم إرجاع السجلات المالية لكل شهر بنجاح',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            month: { type: 'number', example: 8, description: 'رقم الشهر' },
            records: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  startDate:    { type: 'string', example: '2025-08-01' },
                  endDate:      { type: 'string', example: '2025-08-06' },
                  phone:        { type: 'string', example: '0599999999' },
                  invoiceImage: { type: 'string', example: 'http://localhost:3000/uploads/properties/users/invoices/images/invoice1.png', nullable: true },
                  price:        { type: 'number', example: 500 },
                  status:       { type: 'string', example: 'مدفوعة' },
                  reason:       { type: 'string', example: 'عربون' },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب أو العقار غير موجود للمستخدم',
      schema: { example: { statusCode: 404, message: 'العقار السياحي غير موجود للمكتب' } },
    }),
    ApiBadRequestResponse({
      description: 'السنة غير صحيحة',
      schema: { example: { statusCode: 400, message: 'السنة غير صحيحة' } },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
      schema: { example: { statusCode: 500, message: 'حدث خطأ غير متوقع' } },
    }),
  );
}
