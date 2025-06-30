// src/application/dtos/office/update-office.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateOfficeDto, SocialItem } from './create-office.dto';  
import { IsOptional, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SocialItem)
  socials?: SocialItem[];
}
