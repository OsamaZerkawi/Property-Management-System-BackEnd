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
              title:  "شاليه 88.54 م²",
              location:"القامشلي، الحسكة",
              startDate: '2025-01-01',
              endDate: '2025-12-31',
              status: 'مؤجر',
              phone: '0969090711',
              imageUrl: 'http://localhost:3000/uploads/properties/posts/images/post1.jpg',
            },
            invoices: [
              {
                id: 10,
                amount: 2000,
                created_at: '2025-01-01',
                status: 'تم الدفع',
                reason: 'ايجار',
                paymentMethod: 'كاش',
                invoiceImage: 'http://localhost:3000/uploads/UserRentalInvoices/doc1.png',
              },
              {
                id: 11,
                amount: 2000,
                created_at: '2025-02-01',
                status: 'فيد الانتظار',
                reason: 'ايجار',
                paymentMethod: null,
                invoiceImage: null,
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
