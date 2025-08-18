import { InjectRepository } from '@nestjs/typeorm';
import { OfficeFeedback } from 'src/domain/entities/office-feedback.entity';
import { ServiceFeedback } from 'src/domain/entities/service-feedback.entity';
import { ComplaintStatus } from 'src/domain/enums/complaint-status.enum';
import { ComplaintType } from 'src/domain/enums/complaint-type.enum';
import { ComplaintRepositoryInterface } from 'src/domain/repositories/complaint.repository';
import { IsNull, Not, Repository } from 'typeorm';

export class ComplaintRepository implements ComplaintRepositoryInterface {
  constructor(
    @InjectRepository(OfficeFeedback)
    private readonly officeFeedbackRepo: Repository<OfficeFeedback>,
    @InjectRepository(ServiceFeedback)
    private readonly serviceFeedbackRepo: Repository<ServiceFeedback>,
  ) {}
  async findOfficesAndServicesHasComplaints() {
    const offices = await this.officeFeedbackRepo
      .createQueryBuilder('feedback')
      .select([
        'office.id AS id',
        'COUNT(feedback.id) AS complaints_count',
        'office.name AS name',
        'office.type As type',
        'office.logo AS logo',
        'region.name AS region_name',
        'city.name AS city_name',
      ])
      .leftJoin('feedback.office', 'office')
      .leftJoin('office.region', 'region')
      .leftJoin('region.city', 'city')
      .where('feedback.complaint IS NOT NULL')
      .groupBy('office.id, region.id, city.id')
      .getRawMany();

    const serviceProviders = await this.serviceFeedbackRepo
      .createQueryBuilder('feedback')
      .select([
        'sp.id AS id',
        'sp.name AS name',
        'sp.career AS career',
        'COUNT(feedback.id) AS complaints_count',
        'sp.logo AS logo',
        'region.name AS region_name',
        'city.name AS city_name',
      ])
      .leftJoin('feedback.serviceProvider', 'sp')
      .leftJoin('sp.region', 'region')
      .leftJoin('region.city', 'city')
      .where('feedback.complaint IS NOT NULL')
      .groupBy('sp.id, region.id, city.id')
      .getRawMany();

    return { offices, serviceProviders };
  }

  async updateComplaintStatus(
    id: number,
    type: ComplaintType,
    status: ComplaintStatus,
  ) {
    if (type === ComplaintType.OFFICE) {
      await this.officeFeedbackRepo.update({ id }, { status });
    } else if (type === ComplaintType.SERVICE_PROVIDER) {
      await this.serviceFeedbackRepo.update({ id }, { status });
    }
  }

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
