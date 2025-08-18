import { Inject, Injectable } from '@nestjs/common';
import {
  COMPLAINT_REPOSITORY,
  ComplaintRepositoryInterface,
} from 'src/domain/repositories/complaint.repository';

@Injectable()
export class GetOfficeAndServicesHasComplaintUseCase {
  constructor(
    @Inject(COMPLAINT_REPOSITORY)
    private readonly complaintRepo: ComplaintRepositoryInterface,
  ) {}

  async execute(baseUrl: string) {
    const { offices, serviceProviders } =
      await this.complaintRepo.findOfficesAndServicesHasComplaints();

    const officeResult = offices.map((o) => ({
      id: o.id,
      type: 'real-estate',
      office_type: o.type,
      name: o.name,
      complaints_count: Number(o.complaints_count),
      logo: o.logo ? `${baseUrl}/uploads/offices/logos/${o.logo}` : null,
      location: `${o.city_name}, ${o.region_name}`,
    }));

    const serviceResult = serviceProviders.map((s) => ({
      id: s.id,
      type: 'service-provider',
      career: s.career,
      name: s.name,
      complaints_count: Number(s.complaints_count),
      logo: s.logo
        ? `${baseUrl}/uploads/service-providers/logos/${s.logo}`
        : null,
      location: `${s.city_name}, ${s.region_name}`,
    }));

    return [...officeResult, ...serviceResult];
  }
}
