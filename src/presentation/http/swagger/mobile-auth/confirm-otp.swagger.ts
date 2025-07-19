import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { VerifyOtpDto } from 'src/application/dtos/mobile_auth/verify-otp.dto';

export function ConfirmOtpSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تأكيد رمز التحقق وإنشاء الحساب' }),
    ApiBody({
      type: VerifyOtpDto,
      description: 'بيانات التحقق من رمز OTP',
      examples: {
        valid: {
          summary: 'طلب صالح',
          value: {
            email: 'user@example.com',
            otp: '1234',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم تأكيد الرمز وإنشاء الحساب بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إنشاء الحساب بنجاح.',
          data: [],
          status_code: 200,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'خطأ في البيانات أو صلاحية الرمز',
      content: {
        'application/json': {
          examples: {
            EmailNotRegistered: {
              summary: 'البريد غير مسجل أو لم يُرسل له رمز تحقق',
              value: {
                successful: false,
                message: 'لم يُسجّل هذا البريد أو لم يُرسل إليه رمز تحقق',
                status_code: 400,
              },
            },
            OtpInvalidOrExpired: {
              summary: 'رمز التحقق غير صالح أو منتهي الصلاحية',
              value: {
                successful: false,
                message: 'رمز التحقق غير صالح أو انتهت صلاحيته',
                status_code: 400,
              },
            },
          },
        },
      },
    })
  );
}
