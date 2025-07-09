import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsDefined,
  ValidateNested, 
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTourismDto {
  // ========== post ==========
 
  @IsDefined()
  @IsString()
  description: string;

  @IsDefined()
  @IsString()
  tag: string;

  @IsDefined()
  @IsString()
  image: string;

  // ========== public_information ==========
  @IsDefined()
  @IsNumber()
  region_id: number;

  @IsDefined()
  @IsNumber()
  latitude: number;

  @IsDefined()
  @IsNumber()
  longitude: number;

  @IsDefined()
  @IsNumber()
  @Min(1)
  area: number;

  @IsDefined()
  @IsNumber()
  room_count: number;

  @IsDefined()
  @IsNumber()
  living_room_count: number;

  @IsDefined()
  @IsNumber()
  kitchen_count: number;

  @IsDefined()
  @IsNumber()
  bathroom_count: number;

  @IsDefined()
  @IsBoolean()
  has_furniture: boolean;

  // ========== tourism_place ==========
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  additional_services_ids!: number[];

  @IsDefined()
  @IsNumber()
  price!: number;

  @IsDefined()
  @IsString()
  street!: string;

  @IsDefined()
  @IsString()
  electricity!: string;

  @IsDefined()
  @IsString()
  water!: string;

  @IsDefined()
  @IsString()
  pool!: string;
}
