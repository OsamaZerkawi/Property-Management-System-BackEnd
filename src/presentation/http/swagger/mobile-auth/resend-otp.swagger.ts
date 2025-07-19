import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResendOtpDto } from 'src/application/dtos/mobile_auth/resend-otp.dto';

export function ResendOtpSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'إعادة إرسال رمز التحقق إلى البريد الإلكتروني' }),
   ApiConsumes('application/x-www-form-urlencoded'),  
    ApiBody({ type: ResendOtpDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني.',
      schema: {
        example: {
          successful: true,
          message: 'تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني.',
          data: [],
          status_code: 200,
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'رمز التحقق قد أُرسل مسبقاً ولم تنتهِ صلاحيته بعد',
      content: {
        'application/json': {
          example: {
            successful: false,
            message: 'رمز التحقق قد أُرسل مسبقاً ولم تنتهِ صلاحيته بعد',
            status_code: 400,
          },
        },
      },
    }),
  );
}
