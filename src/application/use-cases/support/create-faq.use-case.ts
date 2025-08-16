import { Inject, Injectable } from '@nestjs/common';
import { CreateFaqDto } from 'src/application/dtos/support/create-faq.dto';
import {
  SUPPORT_REPOSITORY,
  SupportRepositoryInterface,
} from 'src/domain/repositories/support.repository';

@Injectable()
export class CreateFaqUseCase {
  constructor(
    @Inject(SUPPORT_REPOSITORY)
    private readonly supportRepo: SupportRepositoryInterface,
  ) {}

  async execute(data: CreateFaqDto) {
    await this.supportRepo.createFaqAndSave(data);
  }
}
