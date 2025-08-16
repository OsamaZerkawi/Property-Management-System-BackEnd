import { IsDefined, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfficeComplaintDto {
  @IsDefined()
  @Type(() => Number)
  office_id: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  complaint: string;
}