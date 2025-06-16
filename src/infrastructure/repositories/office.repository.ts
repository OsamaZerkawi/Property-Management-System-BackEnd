import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { Repository } from "typeorm";  
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto'; 
import { OfficeSocial } from '../../domain/entities/office-social.entity';
import { Connection } from 'typeorm';
export class OfficeRepository implements OfficeRepositoryInterface { 
  constructor(
    @InjectRepository(Office) private readonly officeRepo: Repository<Office>,
    @InjectRepository(OfficeSocial) private readonly socialRepo: Repository<OfficeSocial>,
    private readonly conn: Connection
  ) {}

    async findOneByUserId (userId: number) {
        return await this.officeRepo.findOne({
            where: {user: {id : userId}}
        });
    }

    async getCommission(officeId: number) {
        return await this.officeRepo.findOne({
            where: {id: officeId},
            select: ['id','commission']
        });
    }
    async createOfficeWithSocials(userId: number, dto: CreateOfficeDto): Promise<{ id: number }> {
      return this.conn.transaction(async manager => {
        const office = manager.create(Office, {
          user: { id: userId },
          name: dto.name,
          logo: dto.logo,
          type: dto.type,
          commission: dto.commission,
          booking_period: dto.booking_period,
          deposit_per_m2: dto.deposit_per_m2,
          tourism_deposit:dto.tourism_deposit,
          payment_method: dto.payment_method,
          active: dto.active,
          opening_time: dto.opening_time,
          closing_time: dto.closing_time,
          region: { id: dto.region_id },
        });
        await manager.save(office);
  
        for (const s of dto.socials) {
          const social = manager.create(OfficeSocial, {
            office,
            platform: s.platform,
            link: s.link,
          });
          await manager.save(social);
        }
  
        return { id: office.id };
      });
    }
}