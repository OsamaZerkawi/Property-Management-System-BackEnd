import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function MobileLoginSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تسجيل دخول المستخدم عبر الجوال' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'user@example.com',
            description: 'البريد الإلكتروني للمستخدم',
          },
          password: {
            type: 'string',
            example: 'password123',
            description: 'كلمة المرور',
          },
          device_id: {
            type: 'string',
            example: 'device-abc-123',
            description: 'معرف الجهاز (اختياري)',
          },
          fcm_token: {
            type: 'string',
            example: 'fcm_token_example',
            description: 'رمز Firebase Cloud Messaging (اختياري)',
          },
        },
        required: ['email', 'password'],
      },
    }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم تسجيل الدخول بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تسجيل الدخول بنجاح',
          data: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          status_code: 200,
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'الحساب غير مفعل',
      content: {
        'application/json': {
          example: {
            successful: false,
            message: 'الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني.',
            status_code: 403,
          },
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'بيانات الدخول غير صحيحة',
      content: {
        'application/json': {
          examples: {
            WrongPassword: {
              summary: 'كلمة المرور غير صحيحة',
              value: {
                successful: false,
                message: 'كلمة المرور غير صحيحة',
                status_code: 401,
              },
            },
            InvalidCredentials: {
              summary: 'بيانات الدخول غير صحيحة',
              value: {
                successful: false,
                message: 'بيانات الدخول غير صحيحة',
                status_code: 401,
              },
            },
          },
        },
      },
    }),
  );
}
