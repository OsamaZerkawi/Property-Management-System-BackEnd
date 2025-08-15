import { InjectRepository } from '@nestjs/typeorm';
import { JoinRequest } from 'src/domain/entities/join-request.entity';
import { AdminAgreement } from 'src/domain/enums/admin-agreement.enum';
import { JoinRequestRepositoryInterface } from 'src/domain/repositories/join-requests.repository';
import { Repository } from 'typeorm';

export class JoinRequestRepository implements JoinRequestRepositoryInterface {
  constructor(
    @InjectRepository(JoinRequest)
    private readonly joinRequestRepo: Repository<JoinRequest>,
  ) {}

  async findAll() {
    return await this.joinRequestRepo.find({
        where: {admin_agreement: AdminAgreement.PENDING}
    });
  }

  async updateStatus(id: number, updateData: Partial<JoinRequest>) {
    await this.joinRequestRepo.update(id, updateData);
  }

  async findById(id: number) {
    return this.joinRequestRepo.findOne({ where: { id } });
  }
}
