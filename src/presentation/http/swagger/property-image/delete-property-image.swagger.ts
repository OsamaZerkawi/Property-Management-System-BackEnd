
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function DeletePropertyImageSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'حذف صورة معينة لعقار، خاصة بالداش مكتب' }),
    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار',
      required: true,
    }),
    ApiParam({
      name: 'imageId',
      type: Number,
      description: 'معرف الصورة المراد حذفها',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'تم حذف صورة العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم حذف صورة العقار بنجاح',
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
