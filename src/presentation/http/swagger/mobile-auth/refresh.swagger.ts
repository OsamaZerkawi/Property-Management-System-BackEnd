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
          status: true,
          message: 'تم تحديث رمز الدخول بنجاح',
          data: {
            user: { id: 1 },
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
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
                statusCode: 401,
                message: 'رمز التحديث غير موجود',
                error: 'Unauthorized',
              },
            },
            InvalidToken: {
              summary: 'رمز التحديث غير صالح',
              value: {
                statusCode: 401,
                message: 'رمز التحديث غير صالح',
                error: 'Unauthorized',
              },
            },
            ExpiredToken: {
              summary: 'رمز التحديث منتهي الصلاحية',
              value: {
                statusCode: 401,
                message: 'رمز التحديث منتهي الصلاحية',
                error: 'Unauthorized',
              },
            },
            RefreshTokenHeaderInvalid: {
              summary: 'رمز التحديث الذي تم إرساله غير صحيح أو منتهي الصلاحية (داخل استراتيجية التحقق)',
              value: {
                statusCode: 401,
                message: 'رمز التحديث الذي تم إرساله غير صحيح أو منتهي الصلاحية',
                error: 'Unauthorized',
              },
            },
          },
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'المستخدم غير موجود',
      schema: {
        example: {
          statusCode: 404,
          message: 'المستخدم غير موجود',
          error: 'Not Found',
        },
      },
    }),
  );
}
