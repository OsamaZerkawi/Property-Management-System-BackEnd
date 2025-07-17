
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function UpdatePropertyImageSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'تعديل صورة عقار معين، خاصة بالداش مكتب' }),
    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار',
      required: true,
    }),
    ApiParam({
      name: 'imageId',
      type: Number,
      description: 'معرف الصورة المراد تعديلها',
      required: true,
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'الصورة الجديدة لتحديث صورة العقار',
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'ملف صورة (image)',
          },
        },
        required: ['image'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'تم تعديل صورة العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم تعديل صورة العقار بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'الصورة غير موجودة لهذا العقار',
      schema: {
        example: {
          successful: false,
          message: 'الصورة غير موجودة لهذا العقار',
          status_code: 404,
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
