 
import { RentalContract } from '../entities/rental-contract.entity';

export const RENTAL_CONTRACT_REPOSITORY = 'RENTAL_CONTRACT_REPOSITORY';

export interface RentalContractRepositoryInterface {
  save(contract: RentalContract): Promise<RentalContract>;
  findContractsByOfficeId(officeId: number);
}