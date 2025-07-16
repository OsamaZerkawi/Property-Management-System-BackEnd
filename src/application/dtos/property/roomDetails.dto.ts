import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RoomDetailsDto {
  @ApiProperty({ example: 2, description: 'عدد الغرف الإجمالي' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  room_count: number;

  @ApiProperty({ example: 1, description: 'عدد غرف النوم' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bedroom_count: number;

  @ApiProperty({ example: 1, description: 'عدد غرف المعيشة' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  living_room_count: number;

  @ApiProperty({ example: 1, description: 'عدد المطابخ' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  kitchen_count: number;

  @ApiProperty({ example: 1, description: 'عدد الحمامات' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bathroom_count: number;
}