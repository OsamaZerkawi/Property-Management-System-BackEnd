import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function DeleteUserPostSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'خاصة بتطبيق الجوال'}),

    ApiParam({
      name: 'id',
      type: Number,
      required: true,
      description: 'رقم تعريف المنشور المراد حذفه',
      example: 5,
    }),

    ApiOkResponse({
      description: 'تم حذف المنشور بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم حذف المنشور بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'المنشور غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'المنشور غير موجود',
          errors: [],
          status_code: 404,
        },
      },
    })
  );
}
