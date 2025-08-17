import { InjectRepository } from '@nestjs/typeorm';
import { RegisterSubscriberDto } from 'src/application/dtos/auth/register-subscriber.dto';
import { JoinRequest } from 'src/domain/entities/join-request.entity';
import { AdminAgreement } from 'src/domain/enums/admin-agreement.enum';
import { JoinRequestRepositoryInterface } from 'src/domain/repositories/join-requests.repository';
import { Repository } from 'typeorm';

export class JoinRequestRepository implements JoinRequestRepositoryInterface {
  constructor(
    @InjectRepository(JoinRequest)
    private readonly joinRequestRepo: Repository<JoinRequest>,
  ) {}
  async register(data: RegisterSubscriberDto) {
    const joinRequest = this.joinRequestRepo.create({
      proof_document: data.proof_document,
      agent_type: data.agent_type,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    await this.joinRequestRepo.save(joinRequest);
  }

  async findAll() {
    return await this.joinRequestRepo.find({
      where: { admin_agreement: AdminAgreement.PENDING },
    });
  }

  async updateStatus(id: number, updateData: Partial<JoinRequest>) {
    await this.joinRequestRepo.update(id, updateData);
  }

  async findById(id: number) {
    return this.joinRequestRepo.findOne({ where: { id } });
  }
}
