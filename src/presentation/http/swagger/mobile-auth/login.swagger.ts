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
      status: HttpStatus.NOT_FOUND,
      description: 'البريد الإلكتروني غير موجود',
      content: {
        'application/json': {
          example: {
            successful: false,
            message: 'البريد الالكتروني غير موجود',
            status_code: 404,
          },
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
