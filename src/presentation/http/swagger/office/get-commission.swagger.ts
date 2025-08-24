// src/swagger/commission.swagger.ts
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function CommissionSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'خاص بتطبيق الموبايل',
     }), 
    ApiParam({ name: 'office_id', description: 'معرف المكتب', required: true, schema: { type: 'number', example: 11 } }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'تم إرجاع عمولة المكتب بنجاح',
      schema: {
        example: {
          success: true,
          statusCode: 200,
          message: 'تم ارجاع عمولة ونسبة المكتب',
          data: {
            commission: 0.1,
            deposit_per_m2:0.4
          },
        },
      },
    }), 
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: ' لا يوجد مكتب عقاري',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'لا يوجد مكتب عقاري  بهذا المعرف',
          error: 'Not Found',
          data: null,
        },
      },
    }),
  );
}
