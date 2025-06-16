// src/domain/repositories/office.repository.ts
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';
import { Office } from 'src/domain/entities/offices.entity';

export const OFFICE_REPOSITORY = 'OFFICE_REPOSITORY';

export interface OfficeRepositoryInterface {
  findOneByUserId(userId: number): Promise<Office | null>;
  getCommission(officeId: number): Promise<Pick<Office, 'id' | 'commission'> | null>;
  createOfficeWithSocials(userId: number, dto: CreateOfficeDto): Promise<{ id: number }>;
  findById(id: number): Promise<Office | null>;
  updateOfficeWithSocials(officeId: number, dto: UpdateOfficeDto): Promise<{ id: number }>;
}
