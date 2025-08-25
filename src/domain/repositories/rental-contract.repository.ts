 
import { RentalContract } from '../entities/rental-contract.entity';
import { UserPropertyInvoice } from '../entities/user-property-invoice.entity';

export const RENTAL_CONTRACT_REPOSITORY = 'RENTAL_CONTRACT_REPOSITORY';

export interface RentalContractRepositoryInterface {
  save(contract: RentalContract): Promise<RentalContract>;
  findContractsByOfficeId(officeId: number);
  searchContractsBytitle(officeId: number,keyword: string);
  findByIdWithRelations(id: number): Promise<RentalContract | null>;
  verifyPropertyBelongsToOffice(   propertyId: number,  officeId: number,): Promise<boolean>; 
  findInvoicesByPropertyAndUser(propertyId: number,userId: number,): Promise<UserPropertyInvoice[]>;
  createRentalBooking( userId: number, propertyId: number, periodCount: number, totalPrice: number,paymentIntentId?: string|null )
}