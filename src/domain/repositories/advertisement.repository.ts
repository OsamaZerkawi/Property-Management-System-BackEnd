import { Office } from "../entities/offices.entity";

export const ADVERTISEMENT_REPOSITORY = 'ADVERTISEMENT_REPOSITORY';

export interface AdvertisementRepositoryInterface {
    create(office: Office,period: number,file: Express.Multer.File);
    findAllWithInvoicesByOfficeId(officeId: number);
}