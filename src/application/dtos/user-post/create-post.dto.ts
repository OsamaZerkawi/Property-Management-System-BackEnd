import { StringColorFormat } from "@faker-js/faker/.";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { UserPostPropertyType } from "src/domain/enums/user-post-property-type.enum";

export class CreateUserPostDto {
    @IsString()
    title: string;

    @IsNumber()
    budget: number;

    @IsEnum(UserPostPropertyType)   
    type: UserPostPropertyType;

    @IsString()
    description: string;

    @IsNumber()
    region_id: number;
}