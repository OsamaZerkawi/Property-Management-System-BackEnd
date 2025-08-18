import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function UpdateProfileSwaggerDoc() {
  return applyDecorators(
    ApiTags('User Profile'),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
      description: 'تحديث المعلومات الأساسية والصورة الشخصية للمستخدم (form-data).',
    }),
 
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          first_name: {
            type: 'string',
            example: 'أحمد',
            description: 'الاسم الأول (نص)'
          },
          last_name: {
            type: 'string',
            example: 'العلّامي',
            description: 'اسم العائلة (نص)'
          },
          phone: {
            type: 'string',
            example: '0969090123',
            description: 'رقم الهاتف (يُرسل كنص في form-data)'
          },
          photo: {
            type: 'string',
            format: 'binary',
            description: 'الصورة الشخصية (أرسل كملف في form-data field اسمه photo)'
          },
        }, 
        required: [],
      },
    }),

    ApiResponse({
      status: 200,
      description: 'تم التحديث بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تحديث بيانات المستخدم بنجاح',
          data: null,
          status_code: 200
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'بيانات غير صالحة',
      schema: {
        examples: {
          invalidPhone: {
            value: {
              successful: false,
              message: 'رقم الهاتف غير صالح',
              status_code: 400
            }
          },
          phoneExists: {
            value: {
              successful: false,
              message: 'رقم الهاتف مستخدم بالفعل',
              status_code: 400
            }
          }
        }
      }
    }),

    ApiUnauthorizedResponse({
      description: 'غير مصرح - التوكن غير صالح',
      schema: {
        example: {
          successful: false,
          message: 'تم إلغاء صلاحية التوكن',
          status_code: 401
        }
      }
    }),

    ApiNotFoundResponse({
      description: 'المستخدم غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'المستخدم غير موجود',
          status_code: 404
        }
      }
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم.',
      schema: {
        example: {
          successful: false,
          message: 'حدث خطأ غير متوقع',
          status_code: 500
        }
      }
    }),
  );
}
