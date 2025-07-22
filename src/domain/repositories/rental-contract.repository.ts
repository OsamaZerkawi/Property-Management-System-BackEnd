 
import { RentalContract } from '../entities/rental-contract.entity';
import { UserPropertyInvoice } from '../entities/user-property-invoice.entity';

export const RENTAL_CONTRACT_REPOSITORY = 'RENTAL_CONTRACT_REPOSITORY';

export interface RentalContractRepositoryInterface {
  save(contract: RentalContract): Promise<RentalContract>;
  findContractsByOfficeId(officeId: number);
  findOneById(id: number): Promise<UserPropertyInvoice | null>;
  saveInvoice(invoice: UserPropertyInvoice): Promise<UserPropertyInvoice>;
}