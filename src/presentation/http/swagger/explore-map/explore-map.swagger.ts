// src/docs/explore-map.swagger.ts
import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiOkResponse } from "@nestjs/swagger";

export function ExploreMapSwaggerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'استكشاف العقارات والمكاتب ضمن حدود الخريطة',
      description:
        'هذه الواجهة تقوم بإرجاع مواقع (إحداثيات) العقارات والمكاتب التي تقع داخل الحدود الجغرافية المحددة بواسطة الإحداثيات المرسلة في الطلب.',
    }),

    ApiQuery({
      name: 'minLat',
      required: true,
      description: 'أقل خط عرض (الحد الجنوبي)',
      type: Number,
      example: 33.12345,
    }),
    ApiQuery({
      name: 'maxLat',
      required: true,
      description: 'أعلى خط عرض (الحد الشمالي)',
      type: Number,
      example: 33.67890,
    }),
    ApiQuery({
      name: 'minLng',
      required: true,
      description: 'أقل خط طول (الحد الغربي)',
      type: Number,
      example: 35.12345,
    }),
    ApiQuery({
      name: 'maxLng',
      required: true,
      description: 'أعلى خط طول (الحد الشرقي)',
      type: Number,
      example: 35.67890,
    }),

    ApiOkResponse({
      description: 'تم إرجاع العقارات والمكاتب ضمن حدود الخريطة المحددة بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إرجاع العقارات والمكاتب ضمن حدود الخريطة المحددة بنجاح',
          data: [
            { id: 1, lat: 33.12345, lng: 35.54321, type: 'property' },
            { id: 2, lat: 33.67890, lng: 35.12345, type: 'office' },
          ],
          status_code: 200,
        },
      },
    }),
  );
}
