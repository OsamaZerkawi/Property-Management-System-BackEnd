 
/* src/infrastructure/repositories/office.repository.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Office } from 'src/domain/entities/offices.entity';
import { OfficeSocial } from 'src/domain/entities/office-social.entity';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';
import { NotFoundException } from "@nestjs/common"; 
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto"; 
import { errorResponse } from "src/shared/helpers/response.helper"; 
 

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
      logo: dto.logo || undefined,  
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
 
    if (dto.socials && dto.socials.length > 0) {
      const socials = dto.socials.map(s =>
        manager.create(OfficeSocial, {
          office,
          platform: s.platform,
          link: s.link,
        }),
      );
      await manager.save(socials);
    }
 
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
  async findOfficeByUserId(userId: number): Promise<Office | null> {
    return await this.dataSource
      .getRepository(Office)
      .findOne({ 
        where: { user: { id: userId } },
        select: { id: true } 
      });
  }  

    async getOfficeFees(userId: number) {
        const office = await this.officeRepo
        .createQueryBuilder('office')
        .leftJoin('office.user','user')
        .where('user.id = :userId',{userId})
        .select([
            'office.id',
            'office.type',
            'office.deposit_per_m2',
            'office.booking_period',
            'office.tourism_deposit_percentage',
        ])
        .getOne();

        if(!office){
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب لهذا المعرف',404)
            );
        }

        const result = {
          office_id: office.id,
          booking_period: office.booking_period,
          ...(office.deposit_per_m2 != null && { deposit_per_m2: Number(office.deposit_per_m2) }),
          ...(office.tourism_deposit_percentage != null && { tourism_deposit_percentage: Number(office.tourism_deposit_percentage) }),
        };

        return result;
    }

    async updateOfficeFees(userId: number, data: UpdateOfficeFeesDto) {
        const office = await this.officeRepo
        .createQueryBuilder('office')
        .leftJoin('office.user','user')
        .where('user.id = :userId',{userId})
        .getOne();

        if(!office){
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب عقاري مرتبط بهذا المستخدم',404)
            );
        }

        Object.assign(office,{
           ...('booking_period' in data && { booking_period: data.booking_period }),
           ...('deposit_per_m2' in data && { deposit_per_m2: data.deposit_per_m2 }),
           ...('tourism_deposit_percentage' in data && { tourism_deposit_percentage: data.tourism_deposit_percentage }),
        });

        await this.officeRepo.save(office);
    }
} 