
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function GetPropertyImagesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'جلب صور العقار حسب معرف العقار ، خاصة بالداش مكتب' }),
    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'تم ارجاع صور العقار بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع صور العقار بنجاح',
          data: [
            {
              id: 1,
              image_url: 'http://localhost:3000/uploads/properties/images/property-1-example-123456789.jpg',
            },
            {
              id: 2,
              image_url: 'http://localhost:3000/uploads/properties/images/property-1-example-987654321.jpg',
            },
          ],
          status_code: 200,
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
