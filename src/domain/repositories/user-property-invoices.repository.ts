import { UploadPropertyReservationDto } from "src/application/dtos/user-property-reservation/UploadProeprtyReservation.dto";
import { UserPropertyInvoice } from "../entities/user-property-invoice.entity";

export const USER_PROPERTY_INVOICES_REPOSITORY = 'USER_PROPERTY_INVOICES_REPOSITORY';
export interface UserPropertyInvoiceRepositoryInterface{
    findInvoicesByPropertyId(propertyId: number);
    attachInvoiceImage(id: number,documentImage: string);
    createInvoice(data: UploadPropertyReservationDto,image: string);
    getUserPropertyInvoices(userId: number,propertyId: number);
    saveBulk(invoices: UserPropertyInvoice[]): Promise<UserPropertyInvoice[]>;
    markInvoiceAsPaid(invoiceId: number, paymentIntentId: string)
}