import { IsInt, IsOptional, IsString } from "class-validator";

export class ServiceProviderFeedbackDto{
    @IsInt()
    @IsOptional()
    rate?: number;

    @IsOptional()
    @IsString()
    complaint?: string;
}