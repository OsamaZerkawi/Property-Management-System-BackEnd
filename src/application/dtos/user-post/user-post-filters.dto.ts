import { IsEnum, IsNumber, IsOptional, isValidationOptions } from "class-validator";
import { UserPostPropertyType } from "src/domain/enums/user-post-property-type.enum";

export class UserPostFiltersDto {
    @IsOptional()
    @IsEnum(UserPostPropertyType)
    type?: UserPostPropertyType;

    @IsOptional()
    @IsNumber()
    regionId?: number;
}