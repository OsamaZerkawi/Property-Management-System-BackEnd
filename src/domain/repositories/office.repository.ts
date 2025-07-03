 
// src/domain/repositories/office.repository.ts
import { CreateOfficeDto } from 'src/application/dtos/office/create-office.dto';
import { UpdateOfficeDto } from 'src/application/dtos/office/update-office.dto';
import { Office } from 'src/domain/entities/offices.entity';
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto";
import { UpdateOfficeDto } from "src/application/dtos/office/update-office.dto";
import { Office } from "../entities/offices.entity";
import { CreateOfficeDto } from "src/application/dtos/office/create-office.dto";
import { ExploreMapDto } from "src/application/dtos/map/explore-map.dto";

export const OFFICE_REPOSITORY = 'OFFICE_REPOSITORY';
export interface OfficeRepositoryInterface {
  findOneByUserId(userId: number): Promise<Office | null>;
  getCommission(officeId: number): Promise<Pick<Office, 'id' | 'commission'> | null>;
  createOfficeWithSocials(userId: number, dto: CreateOfficeDto): Promise<{ id: number }>;
  findById(id: number): Promise<Office | null>;
  updateOfficeWithSocials(officeId: number, dto: UpdateOfficeDto): Promise<{ id: number }>;
  findOfficeByUserId(userId: number): Promise<Office | null>  
  getOfficeFees(userId: number);
  updateOfficeFees(userId: number,data:UpdateOfficeFeesDto);

  findTopRatedOffices(page: number,items: number,baseUrl: string);
  findWithinBounds(bounds: ExploreMapDto);
}