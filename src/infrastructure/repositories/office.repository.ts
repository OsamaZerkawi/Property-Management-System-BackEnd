import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto";
import { Office } from "src/domain/entities/offices.entity";
import { OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class OfficeRepository implements OfficeRepositoryInterface { 
    constructor(
        @InjectRepository(Office)
        private readonly officeRepo: Repository<Office>
    ){}

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