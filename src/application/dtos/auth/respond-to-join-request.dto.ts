import { IsBoolean, IsOptional, IsPositive, IsString } from "class-validator";

export class respondToJoinRequestsDto{
    @IsBoolean()
    approved: boolean;

    @IsOptional()
    @IsString()
    reason?: string;
}