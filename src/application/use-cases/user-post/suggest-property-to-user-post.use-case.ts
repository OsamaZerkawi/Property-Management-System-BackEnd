import { Inject } from "@nestjs/common";
import { USER_POST_SUGGESTION_REPOSITORY, UserPostSuggestionRepositoryInterface } from "src/domain/repositories/user-post-suggestion.repository";

export class SuggestPropertyToUserPostUseCase {
    constructor(
        @Inject(USER_POST_SUGGESTION_REPOSITORY)
        private readonly userPostSuggestionRepo: UserPostSuggestionRepositoryInterface,
    ){}

    async execute(propertyId: number,userPostId: number){
        return await this.userPostSuggestionRepo.suggestPropertyToUserPost(propertyId,userPostId);
    }
}