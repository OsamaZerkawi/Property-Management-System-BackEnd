import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';

export function GetPendingUserPostsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع  منشورات المستخدمين ',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لإرجاع جميع المنشورات التي حالتها معلقة (PENDING) مع تفاصيلها وموقعها.',
    }),
    ApiQuery({
      name: 'status',
      required: true,
      enum: UserPostAdminAgreement,
      description: 'نوع الحالة (PENDING أو APPROVED)',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع طلبات منشورات المستخدمين المعلقة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع طلبات منشورات المستخدمين',
          data: [
            {
              id: 1,
              title: 'منزل للبيع',
              description: 'منزل مكون من طابقين بموقع مميز',
              type: 'أجار',
              location: 'الرياض, العليا',
              budget: 250000.0,
              createdAt: '2025-08-15',
              status: 'قيد الانتظار',
            },
            {
              id: 2,
              title: 'شقة للإيجار',
              description: 'شقة ثلاث غرف وصالة قريبة من الخدمات',
              type: 'شراء',
              location: 'جدة, السلامة',
              budget: 4500.0,
              createdAt: '2025-08-14',
              status: 'قيد الانتظار',
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
