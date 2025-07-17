import { PartialType } from '@nestjs/mapped-types';
import { CreateTourismDto } from './create-tourism.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TouristicStatus } from 'src/domain/enums/touristic-status.enum'; // غيّر المسار حسب موقع enum عندك

export class UpdateTourismDto extends PartialType(CreateTourismDto) {
  @IsOptional()
  @IsEnum(TouristicStatus, { message: 'قيمة الحالة (status) غير صالحة' })
  status?: TouristicStatus;
}
