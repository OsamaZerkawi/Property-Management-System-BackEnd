import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/application/dtos/mobile_auth/create-user.dto';

export function SignupSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تسجيل مستخدم جديد (مع صورة اختيارية)' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: CreateUserDto as any,
      description: 'بيانات إنشاء الحساب',
      schema: {
        type: 'object',
        required: [
          'first_name',
          'last_name',
          'phone',
          'email',
          'password',
        ],
        properties: {
          first_name: {
            type: 'string',
            example: 'حسن',
          },
          last_name: {
            type: 'string',
            example: 'زعيتر',
          },
          phone: {
            type: 'string',
            example: '0987654321',
          },
          email: {
            type: 'string',
            example: 'hassan@example.com',
          },
          password: {
            type: 'string',
            example: 'StrongPass123!',
          },
          photo: {
            type: 'string',
            format: 'binary',
            description: 'صورة الملف الشخصي (اختياري)',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم التسجيل بنجاح وتم إرسال رمز التحقق',
      schema: {
        example: {
          succssful: true,
          message: 'تم إرسال رمز التحقق. يرجى التحقق من بريدك الإلكتروني.',
          data: [],
          status_code: 200,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'خطأ في التحقق من صحة البيانات أو نوع الملف',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'الاسم الأول مطلوب',
            'البريد الإلكتروني غير صحيح',
          ],
          error: 'Bad Request',
        },
      },
    }),

    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'تعارض في البريد الإلكتروني أو رمز التحقق',
      content: {
        'application/json': {
          examples: {
            EmailAlreadyUsed: {
              summary: 'البريد الإلكتروني مستخدم بالفعل',
              value: {
                successful: false,
                message: 'البريد الإلكتروني مستخدم بالفعل',
                status_code: 409,
              },
            },
            OtpAlreadySent: {
              summary: 'تم إرسال رمز التحقق مسبقاً',
              value: {
                successful: false,
                message: 'تم إرسال رمز التحقق لهذا البريد مسبقاً. يرجى التحقق من بريدك أو إكمال التفعيل',
                status_code: 409,
              },
            },
          },
        },
      },
    })
  );
}
