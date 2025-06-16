import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostController } from "../controllers/user-post.controller";
import { USER_POST_REPOSITORY } from "src/domain/repositories/user-post.repository";
import { UserPostRepository } from "src/infrastructure/repositories/user-post.repository";
import { GetUserPostsUseCase } from "src/application/use-cases/user-post/get-user-posts.use-case";
import { GetUserPostsWithFiltersUseCase } from "src/application/use-cases/user-post/get-user-posts-with-filters.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([UserPost])
    ],
    controllers:[UserPostController],
    providers:[
        GetUserPostsUseCase,
        GetUserPostsWithFiltersUseCase,
        {
            provide:USER_POST_REPOSITORY,
            useClass: UserPostRepository
        }
    ],
    exports:[
        USER_POST_REPOSITORY,
    ]
})
export class UserPostModule {}