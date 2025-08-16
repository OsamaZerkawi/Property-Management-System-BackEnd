import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GetPendingComplaintsUseCase } from 'src/application/use-cases/complaint/get-pending.complaints.use-case';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { successResponse } from 'src/shared/helpers/response.helper';
import { ApiGetPendingComplaints } from '../swagger/complaint/get-pending-complaints.swagger';
import { ApiTags } from '@nestjs/swagger';
import { RespondToComplaintDto } from 'src/application/dtos/support/respond-complaint.dto';
import { RespondToComplaintUseCase } from 'src/application/use-cases/complaint/respond-to-complaint.use-case';
import { ApiRespondToComplaint } from '../swagger/complaint/respond-to-complaint.swagger';
import { GetOfficeAndServicesHasComplaintUseCase } from 'src/application/use-cases/complaint/get-office-and-services-has-complaint.use-case';
import { ApiGetAgentsWithComplaints } from '../swagger/complaint/get-agents-with-complaint.swagger';

@ApiTags('Complaints')
@Controller('admin/complaints')
export class ComplaintController {
  constructor(
    private readonly getPendingComplaintsUseCase: GetPendingComplaintsUseCase,
    private readonly respondToComplaintUseCase: RespondToComplaintUseCase,
    private readonly getOfficeAndServicesHasComplaintUseCase: GetOfficeAndServicesHasComplaintUseCase,
  ) {}

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiGetAgentsWithComplaints()
  @Get()
  async getAgentWithComplaints(@Req() request: Request) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const result = await this.getOfficeAndServicesHasComplaintUseCase.execute(baseUrl);

    return successResponse(
      result,
      'تم جلب جميع المكاتب ومزودي الخدمة الذين لديهم شكاوى بنجاح',
      200,
    );
  }

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

  @Roles('مشرف', 'مدير')
  @Permissions('إدارة الشكاوي والدعم')
  @ApiRespondToComplaint()
  @Put(':id/respond')
  async respondComplaint(
    @Param('id') id: number,
    @Body() dto: RespondToComplaintDto,
  ) {
    await this.respondToComplaintUseCase.execute(id, dto);

    return successResponse([], 'تم الرد على الشكوى بنجاح', 200);
  }
}
