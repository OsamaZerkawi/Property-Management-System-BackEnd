import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UserPostSuggestionDto { 
    @ApiProperty({ example: 123, description: 'معرف العقار' })
    @IsNumber()
    propertyId: number;

    @ApiProperty({ example: 456, description: 'معرف منشور المستخدم' })
    @IsNumber()
    userPostId: number;
}