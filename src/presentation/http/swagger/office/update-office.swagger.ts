// update-office.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
export function UpdateOfficeSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'تحديث بيانات المكتب' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'يمكن ارسال أي من خصائص المكتب، بما فيها معلومات التواصل الاجتماعي',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', nullable: true },
          logo: { type: 'string', format: 'binary', nullable: true },
          type: { type: 'string', enum: ['سياحي', 'عقاري', 'الكل'], nullable: true },
          commission: { type: 'number', nullable: true },
          booking_period: { type: 'number', nullable: true },
          deposit_per_m2: { type: 'number', nullable: true },
          tourism_deposit: { type: 'number', nullable: true },
          payment_method: { type: 'string', enum: ['دفع الكتروني', 'دفع يدوي'], nullable: true },
          opening_time: { type: 'string', nullable: true, example: '09:00' },
          closing_time: { type: 'string', nullable: true, example: '18:00' },
          region_id: { type: 'number', nullable: true },
          latitude: { type: 'number', nullable: true },
          longitude: { type: 'number', nullable: true },
          socials: {
            type: 'string', // مهم: اجعله string بدلاً من array
            nullable: true,
            description: 'معلومات وسائل التواصل الاجتماعي كـ JSON string',
            example: '[{"id": 1, "link": "https://facebook.com/example"}, {"id": 2, "link": "https://twitter.com/example"}]'
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'تم تحديث بيانات المكتب بنجاح' }),
    ApiResponse({ status: 404, description: 'المكتب غير موجود' }),
    ApiResponse({ status: 400, description: 'خطأ في البيانات المُرسلة' }),
  );
}