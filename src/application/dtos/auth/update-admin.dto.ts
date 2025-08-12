import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds?: number[];
}
