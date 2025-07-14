import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { privateDecrypt } from "crypto";
import { Advertisement } from "src/domain/entities/advertisements.entity";
import { Office } from "src/domain/entities/offices.entity";
import { OnlineInvoice } from "src/domain/entities/online-invoices.entity";
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

    findAllWithInvoicesByOfficeId(officeId: number) {
        return this.advertisementRepo.find({
            where:{office: {id: officeId}},
            relations: ['invoice'],
            order: {created_at: 'DESC'}
        });
    }

    async createWithInvoice(office: Office, period: number, file: Express.Multer.File,amount: number) {
        const advertisement =  this.advertisementRepo.create({
            office,
            day_period:period,
            image:file.filename,
        });

        const invoice = await this.onlineInvoiceRepo.create({
            office,
            amount,
            type:InvoiceType.IMAGE,
            advertisement,
            stripe_payment_intent_id: 0,
        });

        advertisement.invoice = invoice;

        await this.advertisementRepo.save(advertisement);
    }
}