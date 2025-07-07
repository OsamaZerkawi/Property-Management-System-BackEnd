
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function CreateOrUpdateFeedbackSwaggerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'تقديم تقييم أو شكوى لمزود خدمة (يتطلب تسجيل دخول)' }),

    ApiBearerAuth(),

    ApiParam({
      name: 'id',
      required: true,
      type: Number,
      description: 'معرّف مزود الخدمة',
      example: 1,
    }),

    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          rate: {
            type: 'integer',
            example: 4,
            description: 'التقييم من 1 إلى 5 (اختياري)',
          },
          complaint: {
            type: 'string',
            example: 'تأخر في الوصول ولم يكن ملتزمًا بالمواعيد',
            description: 'الشكوى (اختياري)',
          },
        },
        required: [],
      },
    }),

    ApiResponse({
      status: 201,
      description: 'تم التقييم أو تقديم شكوى بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم التقييم او تقديم شكوى بنجاح',
          data: [],
          status_code: 201,
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'لم يتم إرسال تقييم أو شكوى',
      schema: {
        example: {
          successful: false,
          message: 'يجب إرسال تقييم أو شكوى على الأقل',
          data: [],
          status_code: 400,
        },
      },
    }),

ApiResponse({
  status: 401,
  description: 'خطأ في المصادقة أو التوكن',
  content: {
    'application/json': {
      schema: {
        oneOf: [
          {
            type: 'object',
            properties: {
              successful: { type: 'boolean', example: false },
              message: { type: 'string', example: 'لم يتم إرسال بيانات التفويض' },
              data: { type: 'array', items: {}, example: [] },
              status_code: { type: 'number', example: 401 },
            },
          },
          {
            type: 'object',
            properties: {
              successful: { type: 'boolean', example: false },
              message: { type: 'string', example: 'تنسيق التوكن غير صالح' },
              data: { type: 'array', items: {}, example: [] },
              status_code: { type: 'number', example: 401 },
            },
          },
          {
            type: 'object',
            properties: {
              successful: { type: 'boolean', example: false },
              message: { type: 'string', example: 'توكن غير صالح' },
              data: { type: 'array', items: {}, example: [] },
              status_code: { type: 'number', example: 401 },
            },
          },
          {
            type: 'object',
            properties: {
              successful: { type: 'boolean', example: false },
              message: { type: 'string', example: 'تم إلغاء صلاحية التوكن' },
              data: { type: 'array', items: {}, example: [] },
              status_code: { type: 'number', example: 401 },
            },
          },
        ],
      },
      examples: {
        noAuthData: {
          summary: 'لم يتم إرسال بيانات التفويض',
          value: {
            successful: false,
            message: 'لم يتم إرسال بيانات التفويض',
            data: [],
            status_code: 401,
          },
        },
        invalidTokenFormat: {
          summary: 'تنسيق التوكن غير صالح',
          value: {
            successful: false,
            message: 'تنسيق التوكن غير صالح',
            data: [],
            status_code: 401,
          },
        },
        invalidToken: {
          summary: 'توكن غير صالح',
          value: {
            successful: false,
            message: 'توكن غير صالح',
            data: [],
            status_code: 401,
          },
        },
        tokenRevoked: {
          summary: 'تم إلغاء صلاحية التوكن',
          value: {
            successful: false,
            message: 'تم إلغاء صلاحية التوكن',
            data: [],
            status_code: 401,
          },
        },
      },
    },
  },
}),
  );
}
