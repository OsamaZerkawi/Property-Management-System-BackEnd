
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAllPostsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: ' جلب جميع منشورات المستخدم الحالي (صاحب المكتب) خاصة بالداش مكتب' }),
    ApiResponse({
      status: 200,
      description: 'تم ارجاع جميع منشورات المستخدمين بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع منشورات المستخدمين بنجاح',
          data: [
            {
              id: 1,
              title: 'شراء شقة في دمشق',
              description: 'تفاصيل المنشور...',
              type: 'شراء',
              budget: 1200000,
              publishedDate: '2025-07-16',
              location: 'دمشق، المزة',
              isProposed: 1,
            },
            {
              id: 4,
              title: 'تأجير شقة مفروشة',
              description: 'شقة مفروشة للإيجار الشهري بجانب جامعة حلب.',
              type: 'إيجار',
              budget: 250000,
              publishedDate: '2025-07-12',
              location: 'حلب، سيف الدولة',
              isProposed: 0,
            },
          ],
          status_code: 200,
        },
      },
    })
  );
}
