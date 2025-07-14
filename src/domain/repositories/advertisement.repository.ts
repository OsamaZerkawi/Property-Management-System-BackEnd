import { Office } from "../entities/offices.entity";

export const ADVERTISEMENT_REPOSITORY = 'ADVERTISEMENT_REPOSITORY';

export interface AdvertisementRepositoryInterface {
    createWithInvoice(office: Office,period: number,file: Express.Multer.File,amount: number);
    findAllWithInvoicesByOfficeId(officeId: number);
}