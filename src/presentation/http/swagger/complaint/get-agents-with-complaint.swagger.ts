import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetAgentsWithComplaints() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'جلب جميع المكاتب ومزودي الخدمة الذين لديهم شكاوى',
    }),
    ApiResponse({
      status: 200,
      description: 'تم جلب جميع المكاتب ومزودي الخدمة الذين لديهم شكاوى بنجاح',
      schema: {
        example: [
          {
            id: 1,
            type: 'مكتب',
            office_type: 'سياحي', // نوع المكتب
            name: 'مكتب مركزي', // اسم المكتب
            complaints_count: 5,
            logo: 'https://example.com/uploads/offices/logos/logo.png',
            location: 'دمشق, الزاهرة',
          },
          {
            id: 2,
            type: 'مزود خدمة',
            name: 'مقدم خدمة سريع', // اسم مزود الخدمة
            complaints_count: 3,
            logo: 'https://example.com/uploads/service-providers/logos/service-logo.png',
            location: 'دمشق, حرستا',
          },
        ],
      },
    }),
  );
}
