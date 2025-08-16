import { Inject, Injectable } from '@nestjs/common';
import { RespondToComplaintDto } from 'src/application/dtos/support/respond-complaint.dto';
import { ComplaintStatus } from 'src/domain/enums/complaint-status.enum';
import {
  COMPLAINT_REPOSITORY,
  ComplaintRepositoryInterface,
} from 'src/domain/repositories/complaint.repository';

@Injectable()
export class RespondToComplaintUseCase {
  constructor(
    @Inject(COMPLAINT_REPOSITORY)
    private readonly complaintRepo: ComplaintRepositoryInterface,
  ) {}

  async execute(id: number, data: RespondToComplaintDto) {
    const status = data.approved
      ? ComplaintStatus.ACCEPTED
      : ComplaintStatus.REJECTED;

    await this.complaintRepo.updateComplaintStatus(id, data.type, status);
  }
}
