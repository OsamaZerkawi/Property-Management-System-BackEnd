import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAdminDto {
    
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsOptional()
    @IsNumber()
    cityId?: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({each: true})
    permissionIds: number[];    
}