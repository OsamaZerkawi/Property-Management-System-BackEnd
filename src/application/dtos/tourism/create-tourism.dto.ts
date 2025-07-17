import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsDefined,
  ValidateNested, 
  Min,
  IsEnum
} from 'class-validator';
 
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
export class CreateTourismDto {
  // ========== post ==========
 
  @IsDefined()
  @IsString()
  description: string;


  @IsDefined()
  @IsEnum(PropertyPostTag, { message: 'tag يجب أن يكون أحد القيم المحددة' })
  tag: PropertyPostTag;

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
