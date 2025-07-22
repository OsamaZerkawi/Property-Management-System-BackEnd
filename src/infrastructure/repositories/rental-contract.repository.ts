// src/infrastructure/repositories/rental-contract.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RentalContract } from 'src/domain/entities/rental-contract.entity';
import { RentalContractRepositoryInterface } from 'src/domain/repositories/rental-contract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractFiltersDto } from 'src/application/dtos/rental_contracts/filter-rental-contract.dto';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
 
@Injectable()
export class RentalContractRepository  
  implements RentalContractRepositoryInterface 
{
  constructor(
    @InjectRepository(RentalContract)
    private readonly repo: Repository<RentalContract>,
    @InjectRepository(UserPropertyInvoice)
    private readonly Invoicerepo: Repository<UserPropertyInvoice>,) {}

  async save(contract: RentalContract): Promise<RentalContract> {
    return this.repo.save(contract);
  } 
  async findContractsByOfficeId(
    officeId: number,
    filters: ContractFiltersDto = {},
  ): Promise<Array<{
    image: string;
    title: string;
    start_date: string;
    end_date: string;
    phone: string;
    status: string;
  }>> {
    const qb = this.repo.createQueryBuilder('rc')
      .innerJoin('rc.residential', 'r')
      .innerJoin('r.property', 'p', 'p.office_id = :officeId', { officeId })
      .innerJoin('p.post', 'pp', 'pp.status = :postStatus', { postStatus: 'مقبول' })
      .innerJoin('rc.user', 'u') 
      .innerJoin('p.region', 'region')
      .innerJoin('region.city', 'city')
      .select([
        'pp.image AS image',
        'pp.title AS title',
        'rc.start_date AS start_date',
        'rc.end_date AS end_date',
        'u.phone AS phone',
        'r.status AS status',
      ])
      .orderBy('rc.start_date', 'DESC');
  
    if (filters.status) {
    qb.andWhere('rc.status = :status', { status: filters.status }); 
    }
  
    if (filters.cityId) {
      qb.andWhere('city.id = :cityId', { cityId: filters.cityId });
    }

    return qb.getRawMany();
  }
    async findOneById(id: number): Promise<UserPropertyInvoice | null> {
    return this.Invoicerepo.findOne({ where: { id } });
  }
 async saveInvoice(invoice: UserPropertyInvoice): Promise<UserPropertyInvoice> {
    return this.Invoicerepo.save(invoice);
  }
}