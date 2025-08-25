import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { USER_POST_SUGGESTION_REPOSITORY } from "src/domain/repositories/user-post-suggestion.repository";
import { UserPostSuggestionRepository } from "src/infrastructure/repositories/user-post-suggestion.repository";
import { UserPostSuggestionController } from "../controllers/user-post-suggestion.controller";
import { SuggestPropertyToUserPostUseCase } from "src/application/use-cases/user-post/suggest-property-to-user-post.use-case";
import { UserPostModule } from "./user-post.module";
import { ResidentialOfficeModule } from "./residential-office.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostSuggestion } from "src/domain/entities/user-post-suggestions.entity";
import { Property } from "src/domain/entities/property.entity";
import { PropertyModule } from "./property.module";
import { NotificationModule } from "./notification.module";

@Module({
    imports:[
        NotificationModule,
        AuthModule,
        UserPostModule,
        PropertyModule,
        TypeOrmModule.forFeature([UserPost,UserPostSuggestion,Property])
    ],
    controllers:[UserPostSuggestionController],
    providers:[
        SuggestPropertyToUserPostUseCase,
        {
            provide:USER_POST_SUGGESTION_REPOSITORY,
            useClass: UserPostSuggestionRepository
        }
    ],
    exports:[
        USER_POST_SUGGESTION_REPOSITORY
    ]
})
export class UserPostSuggestionModule{

}