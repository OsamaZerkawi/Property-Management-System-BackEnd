import { Advertisement } from "../entities/advertisements.entity";
import { Office } from "../entities/offices.entity";

export const ADVERTISEMENT_REPOSITORY = 'ADVERTISEMENT_REPOSITORY';

export interface AdvertisementRepositoryInterface {
    create(office: Office,period: number,file: Express.Multer.File);
    findAllWithInvoicesByOfficeId(officeId: number);
    findAllWithInvoices();
    findPendingAds();
    findById(id: number);
    update(id: number,fields: Partial<Advertisement>);
    deactivateExpiredAdvertisements(currentDate: Date);
    getApprovedAdvertisement();
    getImagesApprovedAdvertisement(officeId: number): Promise<Advertisement[]>
}