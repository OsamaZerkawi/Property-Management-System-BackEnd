import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { AgentType } from 'src/domain/enums/agent-type.enum';

export function ApiRegisterSubscriberSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تسجيل مشترك جديد (رفع ملف إثبات)' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'بيانات المشترك مع رفع ملف إثبات',
      required: true,
      schema: {
        type: 'object',
        properties: {
          agent_type: {
            type: 'string',
            enum: Object.values(AgentType),
            description: 'نوع الوسيط',
            example: AgentType.OFFICE_OWNER,
          },
          first_name: {
            type: 'string',
            description: 'الاسم الأول',
            example: 'محمد',
          },
          last_name: {
            type: 'string',
            description: 'اسم العائلة',
            example: 'أحمد',
          },
          latitude: {
            type: 'number',
            description: 'خط العرض',
            example: 24.774265,
          },
          longitude: {
            type: 'number',
            description: 'خط الطول',
            example: 46.738586,
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'البريد الإلكتروني',
            example: 'user@example.com',
          },
          proof_document: {
            type: 'string',
            format: 'binary',
            description: 'ملف الإثبات (PDF أو صورة)',
          },
        },
        required: [
          'agent_type',
          'first_name',
          'last_name',
          'latitude',
          'longitude',
          'email',
          'proof_document',
        ],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'تم تسجيل طلبك بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تسجيل طلبك بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'لم يتم رفع ملف الإثبات أو هناك بيانات ناقصة',
      schema: {
        example: {
          successful: false,
          message: 'يجب رفع صورة الوثيقة',
          status_code: 400,
        },
      },
    }),
  );
}
