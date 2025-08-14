
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

export function GetPublicStatsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع الإحصاءات العامة للنظام',
      description:
        'هذه الواجهة تُستخدم لإرجاع عدد المستخدمين، المشرفين، المكاتب، مزودي الخدمات، العقارات للبيع والإيجار، والعقارات السياحية.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع البيانات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع المعلومات العامة',
          data: {
            total_users: 150,
            total_admins: 5,
            total_offices: 12,
            total_service_providers: 20,
            sale_properties: 35,
            rent_properties: 50,
            total_touristic: 8,
          },
          status_code: 200,
        },
      },
    }),
  );
}
