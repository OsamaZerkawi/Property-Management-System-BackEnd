import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse } from "@nestjs/swagger";

export function DeleteSupervisorSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'حذف مشرف',
      description:
        'هذه الواجهة تُستخدم من قبل المدير لحذف مشرف معين بناءً على معرفه (ID). إذا لم يتم العثور على المستخدم، سيتم إرجاع خطأ.',
    }),
    ApiParam({
      name: 'id',
      description: 'معرف المشرف المطلوب حذفه',
      example: 1,
      type: Number,
      required: true,
    }),
    ApiOkResponse({
      description: 'تم حذف المشرف بنجاح',
      schema: {
        example: {
          successful: true,
          message: 'تم حذف المشرف بنجاح',
          data: [],
          status_code: 200,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'المشرف غير موجود',
      schema: {
        example: {
          successful: false,
          message: 'المستخدم غير موجود',
          data: [],
          status_code: 404,
        },
      },
    }),
  );
}
