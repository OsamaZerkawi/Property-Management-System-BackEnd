
// src/swagger/expected-price.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function SwaggerGetExpectedPrice() {
  return applyDecorators(
    ApiOperation({ summary: 'Get expected meter price for a region' }),
    ApiParam({
      name: 'regionId',
      required: true,
      description: 'The ID of the region',
      type: Number,
      example: 3,
    }),
    ApiResponse({
      status: 200,
      description: 'Expected meter price returned successfully',
      schema: {
        type: 'object',
        properties: {
          successful: { type: 'boolean', example: true },
          message: { type: 'string', example: 'تم ارجاع سعر المتر في المنطقة' },
          data: {
            type: 'object',
            properties: {
              meter_price: { type: 'number', example: 1500 },
            },
          },
          status_code: {type: 'integer',example:200}    ,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Region not found',
      schema: {
        type: 'object',
        properties: {
          successful: { type: 'boolean', example: false },
          message: { type: 'string', example: 'لا يوجد منطقة لهذا المعرف' },
          data: { type: 'array', items: {}, example: [] },
          status_code: {type: 'integer',example:404},
        },
      },
    }),
  );
}
