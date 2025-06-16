import { Inject } from "@nestjs/common";
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from "src/domain/repositories/user-property-invoices.repository";

export class UploadInvoiceDocumentUseCase{
    constructor(
       @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
       private readonly userPorpertyInvoicesRepo: UserPropertyInvoiceRepositoryInterface
    ){}

    async execute(invoiceId: number,documentImage: string){
        return await this.userPorpertyInvoicesRepo.attachInvoiceImage(invoiceId,documentImage);
    }
}