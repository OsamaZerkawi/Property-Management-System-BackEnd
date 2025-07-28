import { applyDecorators } from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger';

export function GetGlobalInfoSwaggerDoc() {
  return applyDecorators(
    ApiTags('User'),
    ApiBearerAuth(), 

    ApiOperation({ 
      summary: 'خاصة بتطبيق الجوال',
      description: 'يحصل على الاسم الكامل ورقم الهاتف وصورة المستخدم (إن وجدت)'
    }),

    ApiResponse({
      status: 200,
      description: 'تم جلب البيانات بنجاح',
      schema: {
        example: {
          fullName: 'محمد أحمد',
          phone: '0969090711',
          photoUrl: 'https://example.com/uploads/users/123.jpg'
        }
      }
    }),

    ApiResponse({
      status: 401,
      description: 'غير مصرح بالوصول',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized'
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

    ApiResponse({
      status: 500,
      description: 'خطأ داخلي في الخادم',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error'
        }
      }
    })
  );
}