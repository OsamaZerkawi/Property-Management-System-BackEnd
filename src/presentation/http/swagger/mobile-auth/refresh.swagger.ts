import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';

export function RefreshTokenSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تحديث رمز الدخول باستخدام رمز التحديث (Refresh Token)' }),

    // تعريف الهيدر المطلوب (Authorization Bearer)
    ApiHeader({
      name: 'Authorization',
      description: 'رمز التحديث في الهيدر بصيغة Bearer token',
      required: true,
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم تحديث رمز الدخول بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تحديث رمز الدخول بنجاح',
          data: {
            user: { id: 1 },
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          status_code: 200,
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'رمز التحديث غير موجود أو غير صالح أو منتهي الصلاحية',
      content: {
        'application/json': {
          examples: {
            MissingToken: {
              summary: 'رمز التحديث غير موجود',
              value: {
                successful: false,
                message: 'رمز التحديث غير موجود',
                status_code: 401,
              },
            },
            InvalidToken: {
              summary: 'رمز التحديث غير صالح',
              value: {
                successful: false,
                message: 'رمز التحديث غير صالح',
                status_code: 401,
              },
            },
            ExpiredToken: {
              summary: 'رمز التحديث منتهي الصلاحية',
              value: {
                successful: false,
                message: 'رمز التحديث منتهي الصلاحية',
                status_code: 401,
              },
            },
            RefreshTokenHeaderInvalid: {
              summary: 'رمز التحديث الذي تم إرساله غير صحيح أو منتهي الصلاحية (داخل استراتيجية التحقق)',
              value: {
                successful: false,
                message: 'رمز التحديث الذي تم إرساله غير صحيح أو منتهي الصلاحية',
                status_code: 401,
              },
            },
          },
        },
      },
    }),
    
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'المستخدم غير موجود',
      content: {
        'application/json': {
          example: {
            successful: false,
            message: 'المستخدم غير موجود',
            status_code: 404,
          },
        },
      },
    }),

  );
}
