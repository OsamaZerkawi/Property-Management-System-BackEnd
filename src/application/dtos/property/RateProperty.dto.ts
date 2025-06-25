import { Type } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class RatePropertyDto {
    
    // @Type(() => Number)
    // @IsInt()
    rate: number;
}