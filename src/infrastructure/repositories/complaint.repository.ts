import { InjectRepository } from '@nestjs/typeorm';
import { OfficeFeedback } from 'src/domain/entities/office-feedback.entity';
import { ServiceFeedback } from 'src/domain/entities/service-feedback.entity';
import { ComplaintStatus } from 'src/domain/enums/complaint-status.enum';
import { ComplaintRepositoryInterface } from 'src/domain/repositories/complaint.repository';
import { IsNull, Not, Repository } from 'typeorm';

export class ComplaintRepository implements ComplaintRepositoryInterface {
  constructor(
    @InjectRepository(OfficeFeedback)
    private readonly officeFeedbackRepo: Repository<OfficeFeedback>,
    @InjectRepository(ServiceFeedback)
    private readonly serviceFeedbackRepo: Repository<ServiceFeedback>,
  ) {}

  async findPendingComplaintsForOfficeAndServices() {
    const officeComplaints = await this.officeFeedbackRepo.find({
      where: { status: ComplaintStatus.PENDING, complaint: Not(IsNull()) },
      relations: ['user', 'office'],
      order: { created_at: 'DESC' },
    });

    const serviceComplaints = await this.serviceFeedbackRepo.find({
      where: { status: ComplaintStatus.PENDING, complaint: Not(IsNull()) },
      relations: ['user', 'serviceProvider'],
      order: { created_at: 'DESC' },
    });

    return { officeComplaints, serviceComplaints };
  }
}
