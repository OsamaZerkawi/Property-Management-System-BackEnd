import { IsInt, Min, Max,IsDefined, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOfficeRatingDto {
  @IsDefined()
  @Type(() => Number)
  @IsNumber({}, { message: 'office_id يجب أن يكون رقماً' })
  office_id: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'قيمة التقييم يجب أن تكون >= 0' })
  @Max(5, { message: 'قيمة التقييم يجب أن تكون <= 5' })
  rate: number;
}