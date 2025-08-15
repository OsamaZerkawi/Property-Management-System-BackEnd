import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  JOIN_REQUEST_REPOSITORY,
  JoinRequestRepositoryInterface,
} from 'src/domain/repositories/join-requests.repository';

@Injectable()
export class GetJoinRequetsUseCase {
  constructor(
    @Inject(JOIN_REQUEST_REPOSITORY)
    private readonly joinRequestRepo: JoinRequestRepositoryInterface,
  ) {}

  async execute(baseUrl: string) {
    const requests = await this.joinRequestRepo.findAll();

    return requests.map((req) => ({
      id: req.id,
      created_at: req.created_at.toISOString().split('T')[0],
      agent_type: req.agent_type,
      full_name: `${req.first_name} ${req.last_name}`,
      latitude: req.latitude,
      longitude: req.longitude,
      proof_document: `${baseUrl}/uploads/proof/${req.proof_document}`,
      admin_agreement: req.admin_agreement,
    }));
  }
}
