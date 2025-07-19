// src/infrastructure/repositories/rental-contract.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RentalContract } from 'src/domain/entities/rental-contract.entity';
import { RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { InjectRepository } from '@nestjs/typeorm';
 
@Injectable()
export class RentalContractRepository  
  implements RentalContractRepositoryInterface 
{
  constructor(@InjectRepository(RentalContract)
    private readonly repo: Repository<RentalContract>,) {}

  async save(contract: RentalContract): Promise<RentalContract> {
    return this.repo.save(contract);
  } 
}