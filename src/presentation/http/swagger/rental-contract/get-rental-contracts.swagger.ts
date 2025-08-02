import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'; 
import { ContractStatus } from 'src/domain/enums/rental-contract-status.enum';
export function GetRentalContractsSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'جلب جميع عقود الإيجار مع إمكانية الفلترة' }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ContractStatus,
      description: 'حالة العقد',
      example: ContractStatus.RENTED,
    }),
    ApiQuery({
      name: 'cityId',
      required: false,
      type: Number,
      description: 'معرّف المحافظة',
      example: 2,
    }),
    ApiQuery({
      name: 'regionId',
      required: false,
      type: Number,
      description: 'معرّف المنطقة',
      example: 5,
    }),
    ApiOkResponse({
      description: 'تم جلب عقود الإيجار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب عقود الايجار بنجاح',
          data: [
            {
              id: 4,
              title: 'عقد إيجار شقة سكنية',
              startDate: '2025-03-01',
              endDate: '2026-03-01',
              phone: '0912123456',
              status: 'متوفر',
              imageUrl: 'http://localhost:3000/uploads/UserRentalInvoices/invoice1.jpg',
            },
          ],
          status_code: 200,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب غير موجود',
      schema: {
        example: {
          successful: false,
          error: 'المكتب غير موجود',
          status_code: 404,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ غير متوقع في الخادم',
      schema: {
        example: {
          successful: false,
          error: 'حدث خطأ غير متوقع',
          status_code: 500,
        },
      },
    }),
  );
}
