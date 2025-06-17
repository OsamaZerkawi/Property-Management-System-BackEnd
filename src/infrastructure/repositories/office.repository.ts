/* src/infrastructure/repositories/office.repository.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Office } from 'src/domain/entities/offices.entity';
import { OfficeSocial } from 'src/domain/entities/office-social.entity';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';

@Injectable()
export class OfficeRepository implements OfficeRepositoryInterface {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepo: Repository<Office>,
    @InjectRepository(OfficeSocial)
    private readonly socialRepo: Repository<OfficeSocial>,
    private readonly dataSource: DataSource,
  ) {}

  async findOneByUserId(userId: number): Promise<Office | null> {
    return this.officeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['socials', 'region'],
    });
  }

  async getCommission(officeId: number): Promise<Pick<Office, 'id' | 'commission'> | null> {
    return this.officeRepo.findOne({
      where: { id: officeId },
      select: ['id', 'commission'],
    });
  }

  async createOfficeWithSocials(
    userId: number,
    dto: CreateOfficeDto,
  ): Promise<{ id: number }> {
    return this.dataSource.transaction(async manager => {
      const office = manager.create(Office, {
        user: { id: userId },
        name: dto.name,
        logo: dto.logo,
        type: dto.type,
        commission: dto.commission,
        booking_period: dto.booking_period,
        deposit_per_m2: dto.deposit_per_m2,
        tourism_deposit: dto.tourism_deposit,
        payment_method: dto.payment_method,
        opening_time: dto.opening_time,
        closing_time: dto.closing_time,
        region: { id: dto.region_id } as any,
      });
      await manager.save(office);

      const socials = dto.socials.map(s =>
        manager.create(OfficeSocial, {
          office,
          platform: s.platform,
          link: s.link,
        }),
      );
      await manager.save(socials);

      return { id: office.id };
    });
  }

  async findById(id: number): Promise<Office | null> {
    return this.officeRepo.findOne({
      where: { id },
      relations: ['user', 'socials', 'region','region.city'],
    });
  }
  async updateOfficeWithSocials(
    officeId: number,
    dto: UpdateOfficeDto,
  ): Promise<{ id: number }> {
    return this.dataSource.transaction(async manager => {
      const office = await manager.findOne(Office, {
        where: { id: officeId },
        relations: ['socials'],
      });
      if (!office) throw new Error('Office not found');

      // Assign only defined properties
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && key !== 'socials') {
          (office as any)[key] = value;
        }
      });
      if (dto.region_id !== undefined) {
        office.region = { id: dto.region_id } as any;
      }

      await manager.save(office);

      if (dto.socials) {
        await manager.delete(OfficeSocial, { office: { id: officeId } });
        const newSocials = dto.socials.map(s =>
          manager.create(OfficeSocial, {
            office,
            platform: s.platform,
            link: s.link,
          }),
        );
        await manager.save(newSocials);
      }

      return { id: office.id };
    });
  }
}
