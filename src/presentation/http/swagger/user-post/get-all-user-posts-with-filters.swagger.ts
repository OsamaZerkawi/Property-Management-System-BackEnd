
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserPostPropertyType } from 'src/domain/enums/user-post-property-type.enum';

export function GetAllUserPostsWithFiltersSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'جلب منشورات المستخدمين باستخدام الفلاتر ، خاصة بالداش مكتب' }),
    ApiQuery({
      name: 'type',
      required: false,
      enum: UserPostPropertyType,
      description: 'نوع المنشور (أجار أو شراء)',
    }),
    ApiQuery({
      name: 'regionId',
      required: false,
      type: Number,
      description: 'معرف المنطقة',
    }),
    ApiResponse({
      status: 200,
      description: 'تم ارجاع جميع منشورات المستخدمين بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم ارجاع جميع منشورات المستخدمين بنجاح',
          data: {
            officeCityId:5,
            posts:[
            {
              id: 1,
              title: 'شراء شقة في دمشق',
              description: 'تفاصيل المنشور...',
              type: 'شراء',
              budget: 1200000,
              publishedDate: '2025-07-16',
              location: 'دمشق، المزة',
              isProposed: 1,
            },
            {
              id: 2,
              title: 'أجار منزل في حلب',
              description: 'تفاصيل الأجار...',
              type: 'أجار',
              budget: 500000,
              publishedDate: '2025-07-15',
              location: 'حلب، الجميلية',
              isProposed: 0,
            }],
          },
          status_code: 200,
        },
      },
    })
  );
}
