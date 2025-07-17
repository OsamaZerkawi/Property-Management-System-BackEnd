
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Express } from 'express';

export function UploadPropertyImagesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'رفع صور العقار ، خاصة بالداش مكتب' }),
    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار',
      required: true,
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'صور العقار (يمكن رفع حتى 20 صورة)',
      required: true,
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            maxItems: 20,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'تم حفظ صور العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم حفظ صور العقار بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'العقار غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'العقار غير موجود',
          status_code: 404,
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'ليس لديك صلاحية للوصول لهذا العقار',
      schema: {
        example: {
          successful: false,
          message: 'ليس لديك صلاحية للوصول لهذا العقار',
          status_code: 403,
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
