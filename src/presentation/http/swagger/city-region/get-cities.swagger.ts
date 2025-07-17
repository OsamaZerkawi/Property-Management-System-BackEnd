import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

export function GetAllCitiesSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'استرجاع جميع المحافظات - يتطلب مصادقة' }),
    ApiOkResponse({
      description: 'تم ارجاع المحافظات بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع المحافظات بنجاح',
          data: [
            { id: 1, name: 'دمشق' },
            { id: 2, name: 'ريف دمشق' },
            { id: 3, name: 'حلب' },
            { id: 4, name: 'حمص' },
            { id: 5, name: 'حماة' },
            { id: 6, name: 'اللاذقية' },
            { id: 7, name: 'طرطوس' },
            { id: 8, name: 'إدلب' },
            { id: 9, name: 'الرقة' },
            { id: 10, name: 'دير الزور' },
            { id: 11, name: 'الحسكة' },
            { id: 12, name: 'درعا' },
          ],
          status_code: 200
        }
      }
    })
  );
}
