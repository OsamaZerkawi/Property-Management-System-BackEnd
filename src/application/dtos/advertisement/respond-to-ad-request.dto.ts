import { IsBoolean, IsOptional, IsString } from "class-validator";

export class RespondToAdRequestDto {
    @IsBoolean()
    approved: boolean;

    @IsOptional()
    @IsString()
    reason?: string;
}