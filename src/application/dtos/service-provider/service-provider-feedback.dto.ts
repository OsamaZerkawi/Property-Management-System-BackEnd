import { IsInt, IsOptional, IsString } from "class-validator";

export class ServiceProviderFeedbackDto{
    @IsOptional()
    rate?: number;

    @IsOptional()
    @IsString()
    complaint?: string;
}