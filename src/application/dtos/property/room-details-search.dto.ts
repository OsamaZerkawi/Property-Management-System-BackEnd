import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoomDetailsSearchDto {
  @ApiPropertyOptional({ example: 2, description: 'عدد الغرف الإجمالي' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  room_count?: number;

  @ApiPropertyOptional({ example: 1, description: 'عدد غرف النوم' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bedroom_count?: number;

  @ApiPropertyOptional({ example: 1, description: 'عدد غرف المعيشة' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  living_room_count?: number;

  @ApiPropertyOptional({ example: 1, description: 'عدد المطابخ' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  kitchen_count?: number;

  @ApiPropertyOptional({ example: 1, description: 'عدد الحمامات' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bathroom_count?: number;
}