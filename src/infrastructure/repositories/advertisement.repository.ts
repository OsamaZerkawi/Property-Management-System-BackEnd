import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { privateDecrypt } from "crypto";
import { Advertisement } from "src/domain/entities/advertisements.entity";
import { Office } from "src/domain/entities/offices.entity";
import { OnlineInvoice } from "src/domain/entities/online-invoices.entity";
import { AdminAgreement } from "src/domain/enums/admin-agreement.enum";
import { InvoiceType } from "src/domain/enums/invoice.type.enum";
import { AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";
import { Repository } from "typeorm";

export class AdvertisementRepository implements AdvertisementRepositoryInterface{
    constructor(
        @InjectRepository(Advertisement)
        private readonly advertisementRepo: Repository<Advertisement>,
        @InjectRepository(OnlineInvoice)
        private readonly onlineInvoiceRepo: Repository<OnlineInvoice>,
    ){}

    findAllWithInvoices() {
        return this.onlineInvoiceRepo
        .createQueryBuilder('invoice')
        .leftJoin('invoice.office', 'office')
        .leftJoin('invoice.advertisement', 'advertisement')
        .select([
          'invoice.id',
          'invoice.amount',
          'invoice.type',
          'invoice.paid_date',
          'office.id',
          'office.name',
          'advertisement.id',
          'advertisement.image',          
        ])
        .orderBy('invoice.created_at', 'DESC')
        .getMany();    
    }
    
    async getApprovedAdvertisement() {
        return this.advertisementRepo.find({
            where: {admin_agreement: AdminAgreement.APPROVED},
            select:{
                id: true,
                day_period: true,
                start_date: true,
                image: true,
                is_active:true,
            },
            order:{'start_date':'DESC'},
        });
    }
    
    async deactivateExpiredAdvertisements(currentDate: Date) {
      const result = await this.advertisementRepo
        .createQueryBuilder()
        .update(Advertisement)
        .set({ is_active: false })
        .where('is_active = :active', { active: true })
        .andWhere('start_date IS NOT NULL')
        .andWhere(`start_date + (day_period || ' days')::interval < :today`, { today: currentDate })
        .execute();
  
      return result.affected ?? 0;

    }
    
    async update(id: number, fields: Partial<Advertisement>) {
        await this.advertisementRepo.update(id,fields);
    }
    
    async findById(id: number) {
        return this.advertisementRepo.findOne({
            where: {id},
            relations:['office','office.user']
        });
    }
    
    async findPendingAds() {
        return this.advertisementRepo.find({
            where: {admin_agreement: AdminAgreement.PENDING},
            select:['id','day_period','image']
        });
    }

    findAllWithInvoicesByOfficeId(officeId: number) {
        return this.advertisementRepo.find({
            where:{office: {id: officeId}},
            relations: ['invoice'],
            order: {created_at: 'DESC'}
        });
    }

    async create(office: Office, period: number, file: Express.Multer.File) {
        const advertisement =  this.advertisementRepo.create({
            office,
            day_period:period,
            image:file.filename,
        });
        
        await this.advertisementRepo.save(advertisement);
    }
}