import { Inject, Injectable } from '@nestjs/common';
import {
  COMPLAINT_REPOSITORY,
  ComplaintRepositoryInterface,
} from 'src/domain/repositories/complaint.repository';

@Injectable()
export class GetPendingComplaintsUseCase {
  constructor(
    @Inject(COMPLAINT_REPOSITORY)
    private readonly complaintRepo: ComplaintRepositoryInterface,
  ) {}

  async execute() {
    const { officeComplaints, serviceComplaints } =
      await this.complaintRepo.findPendingComplaintsForOfficeAndServices();

    const officeResult = officeComplaints.map((c) => ({
      id: c.id,
      type: 'مكتب',
      complaint: c.complaint,
      created_at: c.created_at.toISOString().split('T')[0],
      //   user_name: c.user.name,
      user_mobile: c.user.phone,
      office_name: c.office.name,
    }));

    const serviceResult = serviceComplaints.map((c) => ({
      id: c.id,
      type: 'مزود خدمة',
      complaint: c.complaint,
      created_at: c.created_at.toISOString().split('T')[0],
      //   user_name: c.user.name,
      user_mobile: c.user.phone,
      serviceProvider_name: c.serviceProvider.name,
    }));

    return [...officeResult, ...serviceResult];
  }
}
