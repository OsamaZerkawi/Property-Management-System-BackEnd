import { Inject } from "@nestjs/common";
import { UploadPropertyReservationDto } from "src/application/dtos/user-property-reservation/UploadProeprtyReservation.dto";
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from "src/domain/repositories/user-property-invoices.repository";

export class CreateUserProeprtyInvoiceUseCase {
    constructor(
        @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
        private readonly userPropertyInvoiceRepo: UserPropertyInvoiceRepositoryInterface,
    ){}

    async execute(data: UploadPropertyReservationDto,image: string){
        return await this.userPropertyInvoiceRepo.createInvoice(data,image);
    }
}