import { Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadPropertyReservationDto } from "src/application/dtos/user-property-reservation/UploadProeprtyReservation.dto";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { InoviceReasons } from "src/domain/enums/inovice-reasons.enum";
import { InvoicesStatus } from "src/domain/enums/invoices-status.enum";
import { PaymentMethod } from "src/domain/enums/payment-method.enum";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { UserPropertyInvoiceRepositoryInterface } from "src/domain/repositories/user-property-invoices.repository";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class UserPropertyInvoiceRepository implements UserPropertyInvoiceRepositoryInterface {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
        @InjectRepository(UserPropertyInvoice)  
        private readonly userPropertyInvoiceRepo: Repository<UserPropertyInvoice>,
    ){}

    async findInvoicesByPropertyId(propertyId: number) {
        return await this.userPropertyInvoiceRepo
        .createQueryBuilder('invoice')
        .select([
        'invoice.id',
        'invoice.amount',
        'invoice.reason',
        'invoice.status',
        'invoice.paymentMethod',
        'invoice.invoiceImage',
        'invoice.created_at',
        ])
        .where('invoice.property_id = :propertyId',{propertyId})
        .orderBy('invoice.created_at','DESC')
        .getMany();

    }

    async attachInvoiceImage(id: number, documentImage: string) {
        const invoice = await this.userPropertyInvoiceRepo.findOne({
            where: {id} 
        });

        if(!invoice){
            throw new NotFoundException(
                errorResponse('الفاتورة غير موجودة',404)
            );
        }

        invoice.invoiceImage = documentImage;
        invoice.paymentMethod = PaymentMethod.STRIPE;
        invoice.status = InvoicesStatus.PAID;
        
        await this.userPropertyInvoiceRepo.save(invoice);
    }

    async createInvoice(data: UploadPropertyReservationDto, image: string) {
        const property = await this.propertyRepo.findById(data.propertyId);

        if(!property){
            throw new NotFoundException(
                errorResponse('لا يوجد عقار لهذا المعرف',404)
            );
        }

        const user = await this.userRepo.findByPhone(data.phone);

        if(!user){
            throw new NotFoundException(
                errorResponse('لا يوجد مستخدم لهذا الرقم',404)
            );
        }

        const invoice = this.userPropertyInvoiceRepo.create({
            user,
            property,
            invoiceImage:image,
            paymentMethod:PaymentMethod.CASH,
            status:InvoicesStatus.PAID,
            reason:InoviceReasons.PROPERTY_PURCHASE
        });

        await this.userPropertyInvoiceRepo.save(invoice);
    }
}