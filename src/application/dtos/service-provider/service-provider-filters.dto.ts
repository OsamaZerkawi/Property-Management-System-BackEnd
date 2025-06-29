import { IsNumber, IsOptional, IsString } from "class-validator";
import { ServiceProviderType } from "src/domain/enums/service-provider-type.enum";

export class ServiceProviderFiltersDto {
    @IsNumber()
    @IsOptional()
    regionId?: number;

    @IsNumber()
    @IsOptional()
    cityId?: number;

    @IsString()
    @IsOptional()
    career?: ServiceProviderType
}