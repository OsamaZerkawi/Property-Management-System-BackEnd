import { applyDecorators } from '@nestjs/common';
import { 
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';

export function ProfileSwaggerDoc() {
  return applyDecorators(
    ApiTags('User'),
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'خاصة بتطبيق الجوال',
      description: 'يحصل على جميع معلومات المستخدم بما فيها الصورة الشخصية'
    }),

    ApiOkResponse({
      description: 'تم جلب بيانات الملف الشخصي بنجاح', 
      schema: {
        example: {
          first_name: 'محمد',
          last_name: 'أحمد',
          email: 'mohamed.ahmed@example.com',
          phone: '0969090711',
          photo_url: 'https://example.com/uploads/users/123.jpg'
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

    ApiUnauthorizedResponse({
      description: 'غير مصرح - التوكن غير صالح',
      schema: {
        example: {
          statusCode: 401,
          message: 'تم إلغاء صلاحية التوكن'
        }
      }
    }),

    ApiInternalServerErrorResponse({
      description: 'خطأ داخلي في الخادم',
      schema: {
        example: {
          statusCode: 500,
          message: 'حدث خطأ غير متوقع'
        }
      }
    }),
  );
}