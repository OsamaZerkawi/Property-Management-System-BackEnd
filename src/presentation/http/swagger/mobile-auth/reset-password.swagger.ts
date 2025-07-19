import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/application/dtos/mobile_auth/reset-password.dto';

export function ResetPasswordSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'إعادة تعيين كلمة المرور' }),
    ApiBody({ type: ResetPasswordDto }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم تغيير كلمة المرور بنجاح',
      content: {
        'application/json': {
          example: {
            successful: true,
            message: 'تم تغيير كلمة المرور بنجاح',
            status_code: 200,
            data: [],
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

    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'خطأ في البيانات المدخلة',
      content: {
        'application/json': {
          example: {
            successful: false,
            message: 'خطأ في البيانات المدخلة',
            status_code: 400,
          },
        },
      },
    }),
  );
}
