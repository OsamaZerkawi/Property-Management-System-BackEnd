import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPost } from "src/domain/entities/user-post.entity";
import { AuthModule } from "./auth.module";
import { AdminUserPostController } from "../controllers/admin-user-post.controller";
import { UserPostModule } from "./user-post.module";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { GetPostsByStatusUseCase } from "src/application/use-cases/admin-user-post/get-posts-by-status.use-case";
import { RespondToUserPostUseCase } from "src/application/use-cases/admin-user-post/respond-to-post.use-case";
import { NotificationModule } from "./notification.module";
import { Notification } from "src/domain/entities/notification.entity";

@Module({
    imports:[
        NotificationModule,
        AuthModule,
        UserPostModule,
        TypeOrmModule.forFeature([UserPost,Region,City,Notification])
    ],
    controllers:[AdminUserPostController],
    providers:[
        GetPostsByStatusUseCase,
        RespondToUserPostUseCase,
    ],
})
export class AdminUserPostModule {}