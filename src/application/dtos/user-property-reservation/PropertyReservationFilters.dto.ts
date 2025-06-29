import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { PurchaseStatus } from "src/domain/enums/property-purchases.enum";

export class PropertyReservationFiltersDto{
    @IsNumber()
    @IsOptional()
    regionId?: number;

    @IsNumber()
    @IsOptional()
    cityId?: number;

    @IsEnum(PurchaseStatus)
    @IsOptional()
    status?: PurchaseStatus;
}