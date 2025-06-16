import { IsNumber } from "class-validator";

export class UserPostSuggestionDto { 
    @IsNumber()
    propertyId: number;

    @IsNumber()
    userPostId: number;
}