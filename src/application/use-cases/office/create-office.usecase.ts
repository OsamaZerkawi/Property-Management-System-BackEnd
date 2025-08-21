// src/application/use-cases/office/create-office.usecase.ts
import { Injectable, Inject,ConflictException } from '@nestjs/common';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';

@Injectable()
export class CreateOfficeUseCase {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly repo: OfficeRepositoryInterface,
  ) {}

  // async execute(userId: number, dto: CreateOfficeDto) {
  //   const existingOffice = await this.repo.findOfficeByUserId(userId);
  //   if (existingOffice) {
  //     throw new ConflictException('المستخدم يملك مكتب بالفعل. لا يمكن إنشاء أكثر من مكتب واحد');
  //   }
  //  // return this.repo.createOfficeWithSocials(userId, dto);
  // }
}
