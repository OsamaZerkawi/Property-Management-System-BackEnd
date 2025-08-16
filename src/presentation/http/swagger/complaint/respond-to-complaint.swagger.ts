import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RespondToComplaintDto } from 'src/application/dtos/support/respond-complaint.dto';

export function ApiRespondToComplaint() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'الرد على شكوى' }),
    ApiBody({
      description: 'بيانات الرد على الشكوى',
      type: RespondToComplaintDto,
      schema: {
        example: {
          approved: true, // قبول أو رفض الشكوى
          type: 'مكتب', // نوع الشكوى (مكتب | مزود خدمة)
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'تم الرد على الشكوى بنجاح',
      schema: {
        example: {
          success: true,
          message: 'تم الرد على الشكوى بنجاح',
          data: [],
        },
      },
    }),
  );
}
