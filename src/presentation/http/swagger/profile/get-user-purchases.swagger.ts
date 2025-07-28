import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';

export class PurchaseItemDto {
  id: number;
  status: string;
  date: string;
  property_id: number;
  title: string;
  image: string | null;
  address: string;
}

export function MyPurchasesSwaggerDoc() {
  return applyDecorators(
    ApiTags('User Purchases'),
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
      description: 'ترجع جميع العقارات التي قام المستخدم بشرائها'
    }),

    ApiOkResponse({
      description: 'قائمة المشتريات',
      type: [PurchaseItemDto],
      schema: {
        example: [
          {
            id: 125,
            status: "تم البيع",
            date: "2023-10-15",
            property_id: 3,
            title: "فيلا 300م",
            image: "https://example.com/uploads/properties/posts/images/villa.jpg",
            address: "الرياض, حي السفارات"
          },
          {
            id: 126,
            status: "محجوز",
            date: "2023-11-20",
            property_id: 3,
            title: "شقة 200 م",
            image: null,
            address: "الدمام, حي البحيرة"
          }
        ]
      }
    }),

    ApiUnauthorizedResponse({
      description: 'غير مصرح بالوصول',
      schema: {
        example: {
          successful: false,
          message: 'تم إلغاء صلاحية التوكن',
          status_code: 401
        }
      }
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ في الخادم الداخلي',
      schema: {
        example: {
          successful: false,
          message: 'فشل في جلب بيانات المشتريات',
          status_code: 500
        }
      }
    }),
 
  );
}