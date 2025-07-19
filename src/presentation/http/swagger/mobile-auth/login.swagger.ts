import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MobileLoginDto } from 'src/application/dtos/auth/mobile-login.dto';

export function MobileLoginSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تسجيل دخول المستخدم عبر الجوال' }),
    ApiBody({ type: MobileLoginDto }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم تسجيل الدخول بنجاح',
      schema: {
        example: {
          status: true,
          message: 'تم تسجيل الدخول بنجاح',
          data: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'الحساب غير مفعل',
      schema: {
        example: {
          statusCode: 403,
          message: 'الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني.',
          error: 'Forbidden',
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'البريد الإلكتروني غير موجود',
      schema: {
        example: {
          statusCode: 404,
          message: 'البريد الالكتروني غير موجود',
          error: 'Not Found',
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'أخطاء محتملة عند تسجيل الدخول',
      content: {
        'application/json': {
          examples: {
            WrongPassword: {
              summary: 'كلمة المرور غير صحيحة',
              value: {
                statusCode: 401,
                message: 'كلمة المرور غير صحيحة',
                error: 'Unauthorized',
              },
            },
            InvalidCredentials: {
              summary: 'بيانات الدخول غير صحيحة',
              value: {
                statusCode: 401,
                message: 'بيانات الدخول غير صحيحة',
                error: 'Unauthorized',
              },
            },
          },
        },
      },
    })
  );
}
