import { ApiResponse } from '@nestjs/swagger';

export const LogoutSuccessResponse = ApiResponse({
  status: 200,
  description: 'Successful logout',
  schema: {
    example: {
      successful: true,
      message: 'تم تسجيل الخروج بنجاح',
      data: [],
      status_code: 200
    }
  }
});export const JwtAuthUnauthorizedResponse = ApiResponse({
  status: 401,
  description: 'Unauthorized - Any of these token errors',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          successful: { type: 'boolean' },
          error: { type: 'string' },
          status_code: { type: 'number' },
        },
      },
      examples: {
        MissingHeader: {
          summary: 'Header missing',
          value: {
            successful: false,
            error: 'لم يتم إرسال بيانات التفويض',
            status_code: 401,
          },
        },
        InvalidFormat: {
          summary: 'Bad format',
          value: {
            successful: false,
            error: 'تنسيق التوكن غير صالح',
            status_code: 401,
          },
        },
        RevokedToken: {
          summary: 'Token revoked',
          value: {
            successful: false,
            error: 'تم إلغاء صلاحية التوكن',
            status_code: 401,
          },
        },
        InvalidPayload: {
          summary: 'Invalid token payload',
          value: {
            successful: false,
            error: 'توكن غير صالح',
            status_code: 401,
          },
        },
      },
    },
  },
});