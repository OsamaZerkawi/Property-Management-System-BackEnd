
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserPostSuggestionDto } from 'src/application/dtos/user-post/user-post-suggestion.dto';

export function SuggestPropertySwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'اقتراح عقار لمنشور مستخدم ، خاصة بالداش مكتب' }),
    ApiBody({
      type: UserPostSuggestionDto,
      required: true,
      description: 'بيانات الاقتراح',
    }),
    ApiResponse({
      status: 201,
      description: 'تم إضافة اقتراح عقار لمنشور المستخدم',
      schema: {
        example: {
          successful: true,
          message: 'تم إضافة اقتراح عقار لمنشور المستخدم',
          data: [],
          status_code: 201,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'لا يوجد عقار لهذا المعرف',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد عقار لهذا المعرف',
          data: [],
          status_code: 404,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'لا يوجد منشور لهذا المعرف',
      schema: {
        example: {
          successful: false,
          message: 'لا يوجد منشور لهذا المعرف',
          data: [],
          status_code: 404,
        },
      },
    })
  );
}
