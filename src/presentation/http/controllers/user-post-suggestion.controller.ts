import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserPostSuggestionDto } from "src/application/dtos/user-post/user-post-suggestion.dto";
import { SuggestPropertyToUserPostUseCase } from "src/application/use-cases/user-post/suggest-property-to-user-post.use-case";
import { successResponse } from "src/shared/helpers/response.helper";
import { SuggestPropertySwaggerDoc } from "../swagger/user-post-suggestion/suggest-property.swagger";

@Controller('user-post-suggestion')
export class UserPostSuggestionController {
   constructor(
    private readonly ssuggestPropertyToUserPostUseCase: SuggestPropertyToUserPostUseCase,
   ){}

   @Post()
   @SuggestPropertySwaggerDoc()
   @HttpCode(HttpStatus.CREATED)
   async suggestProperty(
    @Body() data: UserPostSuggestionDto
   ){
      const {propertyId, userPostId} = data;
      
      await this.ssuggestPropertyToUserPostUseCase.execute(propertyId,userPostId);

      return successResponse([],'تم إضافة اقتراح عقار لمنشور المستخدم ',201);
   }
}