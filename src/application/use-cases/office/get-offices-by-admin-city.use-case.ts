import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Office } from 'src/domain/entities/offices.entity';
import {
  ADMIN_CITY_REPOSITORY,
  AdminCityRepositoryInterface,
} from 'src/domain/repositories/admin-city.repository';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class GetOfficesByAdminCityUseCase {
  constructor(
    @Inject(ADMIN_CITY_REPOSITORY)
    private readonly adminCityRepo: AdminCityRepositoryInterface,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, baseUrl: string) {
    const cityId = await this.adminCityRepo.findCityIdByUserId(userId);

    let offices;
    if (cityId) {
      offices = await this.officeRepo.findOfficesByCityId(cityId);
    } else {
      offices = await this.officeRepo.findAllOffices();
    }

    return offices.map((office) => {
      return {
        id: office.id,
        logo: `${baseUrl}/uploads/offices/logos/${office.office_logo}`,
        name: office.name,
        type: office.type,
        location: `${office.city_name || ''}، ${
          office.region_name || ''
        }`.trim(),
        rate: {
          avgRate: Number(parseFloat(office.avgRate).toFixed(1)) || 0,
          count: parseInt(office.rateCount, 10) || 0,
        },
      };
    });
  }
}
