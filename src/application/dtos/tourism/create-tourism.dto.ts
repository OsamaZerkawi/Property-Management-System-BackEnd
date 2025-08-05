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
import { PropertyFurnishingType } from 'src/domain/enums/property-furnishing-type.enum';
 
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
  @IsEnum(PropertyFurnishingType)
  has_furniture: PropertyFurnishingType;

  // ========== tourism_place ==========
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  additional_services!: string[];

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
