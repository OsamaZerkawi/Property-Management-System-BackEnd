import { Inject, Injectable } from '@nestjs/common';
import { RegisterSubscriberDto } from 'src/application/dtos/auth/register-subscriber.dto';
import {
  JOIN_REQUEST_REPOSITORY,
  JoinRequestRepositoryInterface,
} from 'src/domain/repositories/join-requests.repository';

@Injectable()
export class RegisterSubscriberUseCase {
  constructor(
    @Inject(JOIN_REQUEST_REPOSITORY)
    private readonly joinRequestRepo: JoinRequestRepositoryInterface,
  ) {}

  async execute(data: RegisterSubscriberDto) {
    await this.joinRequestRepo.register(data);
  }
}
