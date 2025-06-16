// src/application/use-cases/office/create-office.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';

@Injectable()
export class CreateOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly repo: OfficeRepositoryInterface,
  ) {}

  async execute(userId: number, dto: CreateOfficeDto) {
    return this.repo.createOfficeWithSocials(userId, dto);
  }
}
