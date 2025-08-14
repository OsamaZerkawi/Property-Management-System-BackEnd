import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { StatsType } from 'src/domain/enums/stats-type.enum';

export function GetPopularStatsSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'إرجاع الكيانات الأكثر شعبية',
      description:
        'هذه الواجهة تُستخدم لإرجاع قائمة بأكثر المكاتب أو مزوّدي الخدمات شعبية بناءً على تقييماتهم. النوع يحدده باراميتر `type` (OFFICE أو SERVICE_PROVIDER).',
    }),
    ApiQuery({
      name: 'type',
      enum: StatsType,
      required: true,
      description: 'نوع الكيان المراد جلبه: OFFICE أو SERVICE_PROVIDER',
      example: StatsType.OFFICE,
    }),
    ApiOkResponse({
      description: 'تم إرجاع البيانات بنجاح',
      schema: {
        oneOf: [
          // مثال المكاتب
          {
            example: {
              successful: true,
              message: 'تم إرجاع الرائج من المكاتب و مزودي الخدمات',
              data: [
                {
                  id: 1,
                  name: 'مكتب الهدى',
                  logo: 'http://localhost:3000/uploads/offices/logos/logo1.png',
                  type: 'عقاري',
                  location: 'الرياض, المنطقة الوسطى',
                  rate: '4.5',
                  rating_count: 120,
                },
                {
                  id: 2,
                  name: 'مكتب السلام',
                  logo: 'http://localhost:3000/uploads/offices/logos/logo2.png',
                  type: 'هندسي',
                  location: 'جدة, المنطقة الغربية',
                  rate: '4.2',
                  rating_count: 95,
                },
              ],
              status_code: 200,
            },
          },
          // مثال مزودي الخدمات
          {
            example: {
              successful: true,
              message: 'تم إرجاع الرائج من المكاتب و مزودي الخدمات',
              data: [
                {
                  id: 5,
                  name: 'خالد للتصميم',
                  logo: 'http://localhost:3000/uploads/service-providers/logos/logo3.png',
                  career: 'مصمم ديكور',
                  location: 'مكة, المنطقة الغربية',
                  rate: 4.8,
                  rating_count: 75,
                },
                {
                  id: 6,
                  name: 'عبدالله للصيانة',
                  logo: 'http://localhost:3000/uploads/service-providers/logos/logo4.png',
                  career: 'فني صيانة',
                  location: 'الدمام, المنطقة الشرقية',
                  rate: 4.6,
                  rating_count: 50,
                },
              ],
              status_code: 200,
            },
          },
        ],
      },
    }),
  );
}
