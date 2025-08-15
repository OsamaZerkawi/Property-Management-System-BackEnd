
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetJoinRequestsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع جميع طلبات الانضمام',
      description:
        'هذه الواجهة تُستخدم من قبل المشرف لإرجاع جميع طلبات الانضمام الخاصة بالوكلاء مع تفاصيل الموقع والمستندات.',
    }),
    ApiOkResponse({
      description: 'تم إرجاع جميع الطلبات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع جميع الطلبات',
          data: [
            {
              created_at: '2025-08-15',
              agent_type: 'AGENT_TYPE_1',
              full_name: 'محمد أحمد',
              latitude: 25.276987,
              longitude: 55.296249,
              proof_document: 'https://example.com/uploads/proof/document1.jpg',
              admin_agreement: 'PENDING',
            },
            {
              created_at: '2025-08-14',
              agent_type: 'AGENT_TYPE_2',
              full_name: 'علي حسن',
              latitude: 24.466667,
              longitude: 54.366669,
              proof_document: 'https://example.com/uploads/proof/document2.jpg',
              admin_agreement: 'APPROVED',
            },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
