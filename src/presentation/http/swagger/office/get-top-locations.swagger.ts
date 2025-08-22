import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

export function GetTopLocationsSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'خاص بداش المكتب',
      description:
        'يعرض أفضل 10 مناطق (سكنية + سياحية) لأكثر العقارات مبيعاً أو مؤجرة لمكتب عقاري محدد.',
    }), 
    ApiOkResponse({
      description: 'تم جلب أفضل المناطق بنجاح',
      schema: {
        type: 'object',
        properties: {
          residential: {
            type: 'array',
            items: { type: 'string', example: 'دمشق، المزة' },
            description: 'أفضل المناطق السكنية',
          },
          touristic: {
            type: 'array',
            items: { type: 'string', example: 'اللاذقية، وادي قنديل' },
            description: 'أفضل المناطق السياحية',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'خطأ في المعطيات المرسلة (مثلاً officeId غير صحيح)',
    }),
    ApiInternalServerErrorResponse({
      description: 'حدث خطأ غير متوقع في الخادم',
    }),
  );
}
