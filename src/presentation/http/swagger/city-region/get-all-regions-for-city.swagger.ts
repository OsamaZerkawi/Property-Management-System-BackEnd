import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

export function GetRegionsByCitySwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'جلب المناطق حسب معرف المدينة' }),
    ApiParam({
      name: 'cityId',
      required: true,
      type: Number,
      description: 'معرف المدينة',
    }),
    ApiResponse({
      status: 200,
      description: 'تم ارجاع المناطق الخاصة بالمدينة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع المدن الخاصة بالمحافظة بنجاح',
          data: [
            {
              id: 1,
              name: 'المزة',
              default_meter_price: 1000,
            },
            {
              id: 2,
              name: 'المالكي',
              default_meter_price: 1000,
            },
          ],
          status_code: 200,
        },
      },
    })
  );
}
