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
   async findContractsByOfficeId(officeId: number) {
    return this.repo.createQueryBuilder('rc')
      .innerJoin('rc.residential', 'r')
      .innerJoin('r.property', 'p')
      .innerJoin('p.office', 'o', 'o.id = :officeId', { officeId })
      .innerJoin('p.post', 'pp', 'pp.status = :status', {  
        status: 'مقبول',
      })
      .innerJoin('rc.user', 'u')
      .select([
        'pp.image AS image',
        'pp.title AS title',
        'rc.start_date AS start_date',
        'rc.end_date AS end_date',
        'u.phone AS phone',
        'r.status AS status',
      ])
      .orderBy('rc.start_date', 'DESC')
      .getRawMany();
}
}