import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiGetPendingComplaints() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'جلب جميع الشكاوى المعلقة (Pending) للمكاتب ومقدمي الخدمات' }),
    ApiResponse({
      status: 200,
      description: 'تم جلب جميع الشكاوى المعلقة بنجاح',
      schema: {
        example: [
          {
            id: 1,
            type: 'مكتب', // نوع الشكوى: مكتب أو مزود خدمة
            complaint: 'هناك مشكلة في الحجز',
            created_at: '2025-08-16',
            user_mobile: '0591234567',
            office_name: 'مكتب مركزي',
          },
          {
            id: 2,
            type: 'مزود خدمة',
            complaint: 'تأخير في الخدمة',
            created_at: '2025-08-15',
            user_mobile: '0599876543',
            serviceProvider_name: 'مقدم خدمة سريع',
          },
        ],
      },
    }),
  );
}
