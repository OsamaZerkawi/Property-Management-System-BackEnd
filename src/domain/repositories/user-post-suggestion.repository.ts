export const USER_POST_SUGGESTION_REPOSITORY = 'USER_POST_SUGGESTION_REPOSITORY';

export interface UserPostSuggestionRepositoryInterface { 
    suggestPropertyToUserPost(propertyId: number,userPostId: number);
}