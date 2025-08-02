// src/presentation/http/dtos/get‑rental-contracts-filter.dto.ts
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from 'src/domain/enums/rental-contract-status.enum';
 
export class ContractFiltersDto {
  @IsEnum(ContractStatus, { message: 'قيمة الحالة غير صالحة' })
  @IsOptional()
  status?: ContractStatus;

  @Type(() => Number)
  @IsInt({ message: 'معرّف المحافظة يجب أن يكون رقماً صحيحاً' })
  @IsOptional()
  cityId?: number;

  @Type(() => Number)
  @IsInt({ message: 'معرّف المنطقة يجب أن يكون رقماً صحيحاً' })
  @IsOptional()
  regionId?: number;
}
