import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostController } from "../controllers/user-post.controller";
import { USER_POST_REPOSITORY } from "src/domain/repositories/user-post.repository";
import { UserPostRepository } from "src/infrastructure/repositories/user-post.repository";
import { GetUserPostsUseCase } from "src/application/use-cases/user-post/get-user-posts.use-case";
import { GetUserPostsWithFiltersUseCase } from "src/application/use-cases/user-post/get-user-posts-with-filters.use-case";
import { Office } from "src/domain/entities/offices.entity";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { OfficeModule } from "./office.module";

@Module({
    imports:[
        AuthModule,
        OfficeModule,
        TypeOrmModule.forFeature([UserPost,Office,Region,City])
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