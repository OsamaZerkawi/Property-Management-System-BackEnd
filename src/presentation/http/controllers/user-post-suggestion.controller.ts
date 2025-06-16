import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserPostSuggestionDto } from "src/application/dtos/user-post/user-post-suggestion.dto";
import { SuggestPropertyToUserPostUseCase } from "src/application/use-cases/user-post/suggest-property-to-user-post.use-case";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('user-post-suggestion')
export class UserPostSuggestionController {
   constructor(
    private readonly ssuggestPropertyToUserPostUseCase: SuggestPropertyToUserPostUseCase,
   ){}

   @Post()
   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.CREATED)
   async suggestProperty(
    @Body() data: UserPostSuggestionDto
   ){
      const {propertyId, userPostId} = data;
      
      await this.ssuggestPropertyToUserPostUseCase.execute(propertyId,userPostId);

      return successResponse([],'تم إضافة اقتراح عقار لمنشور المستخدم ',201);
   }
}