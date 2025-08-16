import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GetPendingComplaintsUseCase } from 'src/application/use-cases/complaint/get-pending.complaints.use-case';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { successResponse } from 'src/shared/helpers/response.helper';
import { ApiGetPendingComplaints } from '../swagger/complaint/get-pending-complaints.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Complaints')
@Controller('admin/complaints')
export class ComplaintController {
  constructor(
    private readonly getPendingComplaintsUseCase: GetPendingComplaintsUseCase,
  ) {}

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiGetPendingComplaints()
  @Get('pending')
  @HttpCode(HttpStatus.OK)
  async getPendingComplaints() {
    const complaints = await this.getPendingComplaintsUseCase.execute();
    return successResponse(
      complaints,
      'تم جلب جميع الشكاوى المعلقة بنجاح',
      200,
    );
  }
}
