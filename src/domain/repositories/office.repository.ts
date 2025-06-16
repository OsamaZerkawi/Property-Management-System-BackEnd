// src/domain/repositories/office.repository.ts
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto';

export const OFFICE_REPOSITORY = 'OFFICE_REPOSITORY';

export interface OfficeRepositoryInterface {
  findOneByUserId(userId: number);
  getCommission(officeId: number);
  createOfficeWithSocials(userId: number, dto: CreateOfficeDto): Promise<{ id: number }>;
}
