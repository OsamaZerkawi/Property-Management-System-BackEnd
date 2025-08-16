import { Inject, Injectable } from '@nestjs/common';
import { UpdateFaqDto } from 'src/application/dtos/support/update-faq.dto';
import {
  SUPPORT_REPOSITORY,
  SupportRepositoryInterface,
} from 'src/domain/repositories/support.repository';

@Injectable()
export class FindAllFaqsUseCase {
  constructor(
    @Inject(SUPPORT_REPOSITORY)
    private readonly supportRepo: SupportRepositoryInterface,
  ) {}

  async execute() {
    return await this.supportRepo.findAll();
  }
}
