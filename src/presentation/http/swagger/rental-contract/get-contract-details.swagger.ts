import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function GetContractDetailsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(), 
    ApiOperation({ summary: 'تفاصيل عقد إيجار واحد' }),
    ApiParam({ name: 'id', type: Number, description: 'معرف العقد', example: 5 }),
    ApiOkResponse({
      description: 'تم إرجاع تفاصيل العقد والفواتير المرتبطة',
      schema: {
        example: {
          successful: true,
          message: null,
          data: {
            contract: {
              id: 5,
              start_date: '2025-01-01',
              end_date: '2025-12-31',
              status: 'مؤجر',
              post_image: 'http://localhost:3000/uploads/properties/posts/images/post1.jpg',
            },
            invoices: [
              {
                id: 10,
                amount: 2000,
                billing_period_start: '2025-01-01',
                status: 'تم الدفع',
                reason: 'MONTHLY_RENT',
                payment_method: 'كاش',
                documentImage: 'http://localhost:3000/uploads/UserRentalInvoices/doc1.png',
              },
              {
                id: 11,
                amount: 2000,
                billing_period_start: '2025-02-01',
                status: 'فيد الانتظار',
                reason: 'MONTHLY_RENT',
                payment_method: null,
                documentImage: null,
              },
            ],
          },
          status_code: 200,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المكتب أو العقد غير موجود',
      schema: {
        example: {
          successful: false,
          error: 'العقد غير موجود',
          status_code: 404,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
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
