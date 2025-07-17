
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';

export function GetOwnPostsWithStatusSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال' }),

    ApiQuery({
      name: 'status',
      required: true,
      enum: UserPostAdminAgreement,
      description: 'حالة الموافقة على المنشور',
      example: UserPostAdminAgreement.ACCEPTED,
    }),

    ApiOkResponse({
      description: 'تم جلب جيمع المنشورات الخاصة بك مفلترة',
      schema: {
        example: {
          successful: true,
          message: 'تم جلب جيمع المنشورات الخاصة بك مفلترة',
          data: [
            {
              id: 12,
              title: 'أبحث عن شقة للإيجار',
              description: 'أرغب في شقة غرفتين وصالون في دمشق',
              type: 'أجار',
              location: 'دمشق, المزة',
              budget: 500000,
              createdAt: '2025-07-16',
              status: 'مقبول',
            },
          ],
          status_code: 200,
        },
      },
    })
  );
}
