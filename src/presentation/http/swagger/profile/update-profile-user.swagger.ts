import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';

export function UpdateProfileSwaggerDoc() {
  return applyDecorators(
    ApiTags('User Profile'),
    ApiBearerAuth('JWT'),
    ApiConsumes('multipart/form-data'),
    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
      description: 'تحديث المعلومات الأساسية والصورة الشخصية للمستخدم'
    }),

    ApiResponse({
      status: 200,
      description: 'تم التحديث بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تحديث بيانات المستخدم بنجاح',
          data: null
        }
      }
    }),

    ApiResponse({
      status: 400,
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

    ApiResponse({
      status: 401,
      description: 'غير مصرح - التوكن غير صالح',
      schema: {
        example: {
          successful: false,
          message: 'تم إلغاء صلاحية التوكن',
          status_code: 401
        }
      }
    }),

    ApiResponse({
      status: 404,
      description: 'المستخدم غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'المستخدم غير موجود',
          status_code: 404
        }
      }
    }),
  );
}