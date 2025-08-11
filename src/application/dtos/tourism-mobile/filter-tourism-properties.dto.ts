import { IsOptional, IsInt, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
import { SortDirection } from 'src/domain/enums/sort-direction.enum'; 

export class FilterTourismPropertiesDto {
  @IsNumber()
  @IsOptional()
  regionId?: number;

  @IsNumber()
  @IsOptional()
  cityId?: number;

  @IsOptional()
  @IsEnum(PropertyPostTag)
  tag?: PropertyPostTag;

  @IsOptional()
  @IsEnum(SortDirection)
  orderByArea?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection)
  orderByPrice?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection)
  orderByDate?: SortDirection;
}
