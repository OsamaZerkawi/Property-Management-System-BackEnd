
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateUserPostDto } from 'src/application/dtos/user-post/create-post.dto';

export function CreateUserPostSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'إنشاء منشور جديد للمستخدم (خاص بتطبيق الجوال)' }),
    ApiBody({
      type: CreateUserPostDto,
      description: 'بيانات إنشاء المنشور الجديد',
      examples: {
        example1: {
          summary: 'مثال لمنشور شراء',
          value: {
            title: 'أرغب بشراء منزل في دمشق',
            budget: 30000000,
            type: 'شراء',
            description: 'منزل بمساحة لا تقل عن 150 م2',
            region_id: 1,
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'تم إنشاء المنشور بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم إنشاء المنشور بنجاح',
          data: {},
          status_code: 201,
        },
      },
    })
  );
}