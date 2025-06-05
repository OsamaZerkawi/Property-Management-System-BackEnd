import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RoomDetailsDto {
  @IsInt()
  @Min(0)
  @Type(() => Number)
  room_count: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  bedroom_count: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  living_room_count: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  kitchen_count: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  bathroom_count: number;
}
